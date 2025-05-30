 let faqItems = [];

    const quillEditors = [];

    // Load FAQs from localStorage
    window.onload = () => {
      const saved = localStorage.getItem('faqs');
      if (saved) {
        faqItems = JSON.parse(saved);
        renderFAQList();
      } else {
        addNewFAQ(); // Start with one empty
      }
    };

    function addNewFAQ() {
      const newFAQ = {
        question: '',
        answer: ''
      };
      faqItems.push(newFAQ);
      renderFAQList();
    }

    function deleteFAQ(index) {
      faqItems.splice(index, 1);
      renderFAQList();
    }

    function saveAllFAQs() {
      const list = document.querySelectorAll('.faq-item');

      list.forEach((item, index) => {
        const questionInput = item.querySelector('.question-input');
        const quillEditor = quillEditors[index];

        faqItems[index].question = questionInput.value;
        faqItems[index].answer = quillEditor.root.innerHTML;
      });

      try {
        localStorage.setItem('faqs', JSON.stringify(faqItems));
        showNotification('FAQs saved successfully!', 'success');
      } catch (e) {
        showNotification('Failed to save FAQs.', 'error');
      }
    }

    function renderFAQList() {
      const container = document.getElementById('faqList');
      container.innerHTML = '';
      quillEditors.length = 0;

      faqItems.forEach((faq, index) => {
        const div = document.createElement('div');
        div.className = 'faq-item';
        div.setAttribute('draggable', true);
        div.ondragstart = (e) => dragStart(e, index);
        div.ondragover = dragOver;
        div.ondrop = (e) => drop(e, index);

        div.innerHTML = `
          <strong>Question:</strong><br/>
          <input type="text" class="question-input" value="${faq.question}" placeholder="Enter question..." />

          <strong>Answer:</strong><br/>
          <div class="quill-editor" data-index="${index}"></div>

          <div class="actions">
            <button onclick="deleteFAQ(${index})">Delete</button>
          </div>
        `;

        container.appendChild(div);

        // Initialize Quill editor
        const quillDiv = div.querySelector('.quill-editor');
        const quill = new Quill(quillDiv, {
          theme: 'snow',
          modules: {
            toolbar: [
              ['bold', 'italic', 'underline'],
              [{ 'list': 'ordered' }, { 'list': 'bullet' }],
              ['link']
            ]
          }
        });

        quill.root.innerHTML = faq.answer || '<p></p>';
        quillEditors[index] = quill;
      });
    }

    // Drag and Drop Reordering
    let draggedIndex = null;

    function dragStart(e, index) {
      draggedIndex = index;
      e.target.classList.add('drag-over');
    }

    function dragOver(e) {
      e.preventDefault();
      e.target.classList.add('drag-over');
    }

    function drop(e, targetIndex) {
      e.preventDefault();
      e.target.classList.remove('drag-over');

      if (draggedIndex === null || draggedIndex === targetIndex) return;

      const movedItem = faqItems.splice(draggedIndex, 1)[0];
      faqItems.splice(targetIndex, 0, movedItem);

      draggedIndex = null;
      renderFAQList();
    }

    // Notification system
    function showNotification(message, type) {
      const notification = document.getElementById('notification');
      notification.className = 'notification ' + type;
      notification.textContent = message;
      notification.style.display = 'block';

      setTimeout(() => {
        notification.style.display = 'none';
      }, 3000);
    }