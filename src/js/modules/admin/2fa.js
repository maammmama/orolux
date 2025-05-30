const express = require('express');
const router = express.Router();
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');
const crypto = require('crypto');
const { verifyAdminPassword } = require('../middleware/auth');

// Encryption functions
const encrypt = (text, secretKey) => {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(secretKey), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
};

const decrypt = (text, secretKey) => {
    const parts = text.split(':');
    const iv = Buffer.from(parts.shift(), 'hex');
    const encryptedText = Buffer.from(parts.join(':'), 'hex');
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(secretKey), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
};

// This file is a backend Express router for 2FA. No frontend localStorage or client-side logic is present here.

// Get 2FA status
router.get('/2fa-status', verifyAdminPassword, async (req, res) => {
    try {
        const admin = await Admin.findById(req.admin.id);
        if (!admin) {
            return res.status(404).json({ error: 'Admin not found' });
        }

        let secret;
        if (admin.twoFactorSecret) {
            secret = decrypt(admin.twoFactorSecret, process.env.ENCRYPTION_KEY);
        }

        res.json({
            enabled: admin.twoFactorEnabled,
            lastModified: admin.twoFactorModifiedAt,
            method: admin.twoFactorMethod,
            hasRecoveryCodes: admin.recoveryCodes && admin.recoveryCodes.length > 0
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Generate 2FA setup
router.post('/generate-2fa', verifyAdminPassword, async (req, res) => {
    try {
        const admin = await Admin.findById(req.admin.id);
        if (!admin) {
            return res.status(404).json({ error: 'Admin not found' });
        }

        // Generate a secret
        const secret = speakeasy.generateSecret({
            name: `AdminPanel:${admin.email}`,
            length: 32
        });

        // Encrypt the secret before storing
        const encryptedSecret = encrypt(secret.base32, process.env.ENCRYPTION_KEY);

        // Generate QR code data URL
        QRCode.toDataURL(secret.otpauth_url, (err, data_url) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Error generating QR code' });
            }

            res.json({
                secret: secret.base32,
                qrCode: data_url,
                otpauthUrl: secret.otpauth_url
            });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Enable 2FA
router.post('/enable-2fa', verifyAdminPassword, async (req, res) => {
    try {
        const { method, secret, code, phoneNumber } = req.body;
        
        // Validate the TOTP code
        const verified = speakeasy.totp.verify({
            secret: secret,
            encoding: 'base32',
            token: code,
            window: 1
        });

        if (!verified) {
            return res.status(400).json({ error: 'Invalid verification code' });
        }

        // Encrypt the secret before storing
        const encryptedSecret = encrypt(secret, process.env.ENCRYPTION_KEY);

        // Generate recovery codes
        const recoveryCodes = Array(8).fill().map(() => {
            return crypto.randomBytes(6).toString('hex').toUpperCase().match(/.{1,4}/g).join('-');
        });

        // Update admin in database
        const admin = await Admin.findByIdAndUpdate(req.admin.id, {
            twoFactorEnabled: true,
            twoFactorMethod: method,
            twoFactorSecret: encryptedSecret,
            twoFactorModifiedAt: new Date(),
            recoveryCodes: recoveryCodes,
            ...(method === 'sms' && { twoFactorPhone: phoneNumber })
        }, { new: true });

        // Invalidate all other sessions
        await Session.deleteMany({ adminId: req.admin.id, _id: { $ne: req.session.id } });

        res.json({
            success: true,
            recoveryCodes
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Disable 2FA
router.post('/disable-2fa', verifyAdminPassword, async (req, res) => {
    try {
        // Update admin in database
        const admin = await Admin.findByIdAndUpdate(req.admin.id, {
            twoFactorEnabled: false,
            twoFactorMethod: null,
            twoFactorSecret: null,
            twoFactorModifiedAt: new Date(),
            recoveryCodes: []
        }, { new: true });

        // Invalidate all other sessions
        await Session.deleteMany({ adminId: req.admin.id, _id: { $ne: req.session.id } });

        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Regenerate recovery codes
router.post('/regenerate-recovery-codes', verifyAdminPassword, async (req, res) => {
    try {
        // Generate new recovery codes
        const recoveryCodes = Array(8).fill().map(() => {
            return crypto.randomBytes(6).toString('hex').toUpperCase().match(/.{1,4}/g).join('-');
        });

        // Update admin in database
        const admin = await Admin.findByIdAndUpdate(req.admin.id, {
            recoveryCodes: recoveryCodes
        }, { new: true });

        res.json({
            success: true,
            recoveryCodes
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Verify 2FA code (for login)
router.post('/verify-2fa', async (req, res) => {
    try {
        const { email, code } = req.body;
        
        const admin = await Admin.findOne({ email });
        if (!admin || !admin.twoFactorEnabled) {
            return res.status(400).json({ error: 'Invalid request' });
        }

        // Decrypt the secret
        const secret = decrypt(admin.twoFactorSecret, process.env.ENCRYPTION_KEY);

        // Verify the code
        const verified = speakeasy.totp.verify({
            secret: secret,
            encoding: 'base32',
            token: code,
            window: 1
        });

        if (!verified) {
            // Check if it's a recovery code
            if (!admin.recoveryCodes.includes(code)) {
                return res.status(400).json({ error: 'Invalid verification code' });
            }
            
            // Remove the used recovery code
            await Admin.findByIdAndUpdate(admin.id, {
                $pull: { recoveryCodes: code }
            });
        }

        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;