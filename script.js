// const fs = require('fs');

let sections = [];
  window.addEventListener('DOMContentLoaded', () => {
    const stored = localStorage.getItem('presentationData');

    if (!stored) {
      alert('No presentation data found.');
      return;
    }

    data = JSON.parse(stored);
    PresenttationPage(); // now it has data
  });
  document.getElementById('back-to-editor')?.addEventListener('click', () => {
    window.location.href = 'index.html'; // or your actual editor page
  });
  
    function addStep() {
      const container = document.getElementById('steps');
      const div = document.createElement('div');
      div.className = 'step';

      // Generate unique editor ID
      const editorId = 'editor-' + Math.random().toString(36).substring(2, 9);

      div.innerHTML = `
        <label>Step Title: <input class="step-title"></label>
        <div class="toolbar">
          <button onclick="exec('${editorId}', 'bold')"><b>B</b></button>
          <button onclick="exec('${editorId}', 'italic')"><i>I</i></button>
          <button onclick="exec('${editorId}', 'underline')"><u>U</u></button>
          <button onclick="exec('${editorId}', 'insertOrderedList')">1.</button>
          <button onclick="exec('${editorId}', 'insertUnorderedList')">•</button>
        </div>
        <div id="${editorId}" class="editor" contenteditable="true">
          Paste content here or type...
        </div>
      `;

      container.appendChild(div);
    }

    document.getElementById('jsonUpload')?.addEventListener('change', function (e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = function (event) {
      try {
        const uploadedData = JSON.parse(event.target.result);

        if (!Array.isArray(uploadedData)) {
          alert("Invalid JSON format: expected an array.");
          return;
        }

        // Replace existing data
        sections = uploadedData;
        updatePreview();
      } catch (err) {
        alert("Error reading JSON: " + err.message);
      }
    };

    reader.readAsText(file);
  });

    function exec(editorId, command) {
      const editor = document.getElementById(editorId);
      editor.focus();
      document.execCommand(command);
    }

    function saveSection() {
      const title = document.getElementById('titleInput').value.trim();
      const description = document.getElementById('descInput').value.trim();

      if (!title) {
        alert("Please enter a section title.");
        return;
      }

      const stepElements = document.querySelectorAll('#steps .step');
      const steps = Array.from(stepElements).map(step => {
        return {
          title: step.querySelector('.step-title').value || "Untitled Step",
          cont: step.querySelector('.editor').innerHTML
        };
      });

      const newSection = { title, description, details: steps };

      // 🔁 Merge if same title
      const existing = sections.find(sec => sec.title === title);
      if (existing) {
        existing.details.push(...newSection.details);
      } else {
        sections.push(newSection);
      }

      document.getElementById('steps').innerHTML = '';
      updatePreview();
    }

    function startNewSection() {
      document.getElementById('titleInput').value = '';
      document.getElementById('descInput').value = '';
      document.getElementById('steps').innerHTML = '';
    }

    function updatePreview() {
    const preview = document.getElementById('preview');
    preview.innerHTML = '';

    sections.forEach((section, i) => {
      const div = document.createElement('div');
      div.className = 'section';
      div.innerHTML = `
        <h3>${i + 1}. ${section.title}</h3>
        <p>${section.description}</p>
        <ul class="steps-container">
          ${section.details.map(step => `
            <li>
              <strong>${step.title}</strong>: 
              <div class="step-html">${step.cont}</div>
            </li>
          `).join('')}
        </ul>
      `;
      preview.appendChild(div);
      localStorage.setItem('presentationData', JSON.stringify(sections));
    });
  }

    function SaveDataFromCreatePresPAge(){
      const json = JSON.stringify(sections, null, 2); // Proper JSON

      const blob = new Blob([json], { type: 'application/json' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'data.json';
      a.click();
    }

    function startPresentation() {
      localStorage.setItem('presentationData', JSON.stringify(sections));
      window.location.href = 'presentation.html';
      document.getElementById('jsonUpload').value = ''
      PresenttationPage()
    }

    function PresenttationPage() {  
      const cardContainer = document.getElementById('card-container');
      const container = document.getElementById('container');
      // const cardTitle = document.getElementById('card-title');
      // const cardDet = document.getElementById('card-det');
      const backButton = document.createElement('button');
      
      backButton.textContent = '👈 Back';
      backButton.className = 'back-button';
      backButton.style.display = 'none'
      backButton.addEventListener('click', () => {
        const stepView = document.getElementById('step-detail-view');

        if (stepView.style.display === 'block') {
          // 👈 If we're in step view, go back to the card view
          stepView.style.display = 'none';
          document.getElementById('container').style.display = 'block';
        } else {
          // 👈 If we're already in card view, go back to all cards
          document.querySelectorAll('.card-wrapper').forEach(w => {
            w.querySelector('.card').style.display = 'block';
            w.querySelector('.card-container-details').style.display = 'none';
          });
          backButton.style.display = 'none';
        }
      });
      
      data.forEach(item => {
        // Create wrapper
        const wrapper = document.createElement('div');
        wrapper.className = 'card-wrapper';

        // Create card
        const card = document.createElement('div');
        card.className = 'card';

        const title = document.createElement('h3');
        title.textContent = item.title;

        const desc = document.createElement('p');
        desc.textContent = item.description;
        desc.className = 'card-description';

        
        card.appendChild(title);
        card.appendChild(desc);

        // Create details container
        const cardDetails = document.createElement('div');
        cardDetails.className = 'card-container-details';
        cardDetails.style.display = 'none';

        // Create a list of details
        const detailsList = document.createElement('ul');
        detailsList.className = 'details-list';

        item.details.forEach((step, index, array) => {
          const li = document.createElement('li');
          li.textContent = step.title;
          li.className = 'card-description-details';
        
          const angle = (360 / array.length) * index;
          li.style.transform = `rotate(${angle}deg) translate(100px) rotate(-${angle}deg)`;
        
          // 👉 Step Click Event
          li.addEventListener('click', () => {
            // Hide all views
            document.getElementById('container').style.display = 'none';
            document.getElementById('step-detail-view').style.display = 'block';
            backButton.style.display = 'block'; // Optional
            // console.dir(document.getElementsByTagName('body'))
            document.getElementsByTagName('body')[0].style.background ='rgb(180 229 211)'

            // Set step content
            document.getElementById('step-title').textContent = step.title;
            // document.getElementById('step-content').innerHTML = step.cont;
            const iframe = document.createElement('iframe');
            iframe.style.minWidth = '65dvw';
            iframe.style.minHeight = '25dvw';
            // iframe.style.minHeight = '200px';
            // iframe.style.maxWidth = '1500px';
            iframe.style.border = 'none';

            

            iframe.srcdoc = step.cont;
            
            const contentEl = document.getElementById('step-content');
            contentEl.innerHTML = ''; // Clear previous content
            contentEl.appendChild(iframe);
          });
        
          detailsList.appendChild(li);
        });
        
        // Create back button
    
        // Assemble the detail view
        cardDetails.appendChild(detailsList);
        
        // Append to wrapper
        wrapper.appendChild(card);
        wrapper.appendChild(cardDetails);
        cardContainer?.appendChild(wrapper);
        
        // Card click event
        card.addEventListener('click', () => {
          document.getElementsByTagName('body')[0].style.background ='rgb(180 229 211)'

          document.querySelectorAll('.card-wrapper').forEach(w => {
            w.querySelector('.card').style.display = 'none';
            w.querySelector('.card-container-details').style.display = 'none';
          });
          // document.getElementsByTagName('body')[0].style.background ='rgb(243 216 227)'

          card.style.display = 'block';
          cardDetails.style.display = 'block';
          backButton.style.display = 'block';
          container.appendChild(cardContainer);
        });
      });
      
      document.getElementById('page-footer').appendChild(backButton); 
    };
