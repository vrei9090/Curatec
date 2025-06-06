        // DOM Elements
        const observationDropArea = document.getElementById('observation-drop-area');
        const observationFileInput = document.getElementById('observation-file');
        const observationFileName = document.getElementById('observation-file-name');
        const clearObservationBtn = document.getElementById('clear-observation');
        
        const photosDropArea = document.getElementById('photos-drop-area');
        const photoFilesInput = document.getElementById('photo-files');
        const photosCount = document.getElementById('photos-count');
        const clearPhotosBtn = document.getElementById('clear-photos');
        
        const audioDropArea = document.getElementById('audio-drop-area');
        const audioFileInput = document.getElementById('audio-file');
        const audioFileName = document.getElementById('audio-file-name');
        const clearAudioBtn = document.getElementById('clear-audio');
        
        const observationPreviewContainer = document.getElementById('observation-preview-container');
        const observationPreview = document.getElementById('observation-preview');
        const photosPreviewContainer = document.getElementById('photos-preview-container');
        const photosPreview = document.getElementById('photos-preview');
        const audioPreviewContainer = document.getElementById('audio-preview-container');
        const audioPreview = document.getElementById('audio-preview');
        const noFilesMessage = document.getElementById('no-files-message');
        
        const reportPreviewContainer = document.getElementById('report-preview-container');
        const reportPreview = document.getElementById('report-preview');
        const previewBtn = document.getElementById('preview-btn');
        const generateBtn = document.getElementById('generate-btn');
        const progressContainer = document.getElementById('progress-container');
        const progressBar = document.getElementById('progress-bar');
        const progressPercent = document.getElementById('progress-percent');
        const exportButtons = document.getElementById('export-buttons');
        const exportPdfBtn = document.getElementById('export-pdf');
        const exportWordBtn = document.getElementById('export-word');
        
        const fullscreenModal = document.getElementById('fullscreen-modal');
        const fullscreenPreview = document.getElementById('fullscreen-preview');
        const fullscreenPreviewContent = document.getElementById('fullscreen-preview-content');
        const closeFullscreenBtn = document.getElementById('close-fullscreen');
        const refreshPreviewBtn = document.getElementById('refresh-preview');

        // State
        let uploadedFiles = {
            observation: null,
            photos: [],
            audio: null
        };

        // Event Listeners
        observationFileInput.addEventListener('change', handleFileSelect);
        photoFilesInput.addEventListener('change', handleFileSelect);
        audioFileInput.addEventListener('change', handleFileSelect);
        
        clearObservationBtn.addEventListener('click', () => clearFile('observation'));
        clearPhotosBtn.addEventListener('click', () => clearFile('photos'));
        clearAudioBtn.addEventListener('click', () => clearFile('audio'));
        
        previewBtn.addEventListener('click', generatePreview);
        generateBtn.addEventListener('click', generateReport);
        exportPdfBtn.addEventListener('click', () => exportReport('pdf'));
        exportWordBtn.addEventListener('click', () => exportReport('word'));
        
        fullscreenPreview.addEventListener('click', openFullscreenPreview);
        closeFullscreenBtn.addEventListener('click', closeFullscreenPreview);
        refreshPreviewBtn.addEventListener('click', generatePreview);

        // Drag and Drop Events
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            observationDropArea.addEventListener(eventName, preventDefaults, false);
            photosDropArea.addEventListener(eventName, preventDefaults, false);
            audioDropArea.addEventListener(eventName, preventDefaults, false);
        });
        
        ['dragenter', 'dragover'].forEach(eventName => {
            observationDropArea.addEventListener(eventName, highlight, false);
            photosDropArea.addEventListener(eventName, highlight, false);
            audioDropArea.addEventListener(eventName, highlight, false);
        });
        
        ['dragleave', 'drop'].forEach(eventName => {
            observationDropArea.addEventListener(eventName, unhighlight, false);
            photosDropArea.addEventListener(eventName, unhighlight, false);
            audioDropArea.addEventListener(eventName, unhighlight, false);
        });
        
        observationDropArea.addEventListener('drop', handleDrop, false);
        photosDropArea.addEventListener('drop', handleDrop, false);
        audioDropArea.addEventListener('drop', handleDrop, false);

        // Functions
        function preventDefaults(e) {
            e.preventDefault();
            e.stopPropagation();
        }
        
        function highlight(e) {
            const dropArea = e.currentTarget;
            dropArea.classList.add('active');
        }
        
        function unhighlight(e) {
            const dropArea = e.currentTarget;
            dropArea.classList.remove('active');
        }
        
        function handleDrop(e) {
            const dt = e.dataTransfer;
            const files = dt.files;
            const dropArea = e.currentTarget;
            
            if (dropArea === observationDropArea) {
                handleObservationFile(files[0]);
            } else if (dropArea === photosDropArea) {
                handlePhotoFiles(files);
            } else if (dropArea === audioDropArea) {
                handleAudioFile(files[0]);
            }
        }
        
        function handleFileSelect(e) {
            const input = e.target;
            if (input === observationFileInput) {
                handleObservationFile(input.files[0]);
            } else if (input === photoFilesInput) {
                handlePhotoFiles(input.files);
            } else if (input === audioFileInput) {
                handleAudioFile(input.files[0]);
            }
        }
        
        function handleObservationFile(file) {
            if (!file) return;
            
            const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'text/plain'];
            if (!validTypes.includes(file.type)) {
                alert('Veuillez sélectionner un fichier PDF, JPG, PNG ou TXT');
                return;
            }
            
            uploadedFiles.observation = file;
            observationFileName.textContent = file.name;
            observationFileName.classList.remove('hidden');
            clearObservationBtn.classList.remove('hidden');
            
            previewFile(file, 'observation');
            checkFilesStatus();
        }
        
        function handlePhotoFiles(files) {
            if (!files || files.length === 0) return;
            
            const validTypes = ['image/jpeg', 'image/png'];
            Array.from(files).forEach(file => {
                if (!validTypes.includes(file.type)) {
                    alert('Veuillez sélectionner uniquement des fichiers JPG ou PNG pour les photos');
                    return;
                }
                
                // Limit to 10 photos
                if (uploadedFiles.photos.length >= 10) {
                    alert('Vous ne pouvez ajouter que 10 photos maximum');
                    return;
                }
                
                uploadedFiles.photos.push(file);
            });
            
            if (uploadedFiles.photos.length > 0) {
                photosCount.textContent = ${uploadedFiles.photos.length} photo${uploadedFiles.photos.length > 1 ? 's' : ''};
                photosCount.classList.remove('hidden');
                clearPhotosBtn.classList.remove('hidden');
                
                previewFiles(uploadedFiles.photos, 'photos');
                checkFilesStatus();
            }
        }
        
        function handleAudioFile(file) {
            if (!file) return;
            
            if (file.type !== 'audio/mpeg') {
                alert('Veuillez sélectionner un fichier MP3');
                return;
            }
            
            uploadedFiles.audio = file;
            audioFileName.textContent = file.name;
            audioFileName.classList.remove('hidden');
            clearAudioBtn.classList.remove('hidden');
            
            previewFile(file, 'audio');
            checkFilesStatus();
        }
        
        function previewFile(file, type) {
            if (type === 'observation') {
                observationPreviewContainer.classList.remove('hidden');
                
                if (file.type === 'application/pdf') {
                    observationPreview.innerHTML = 
                        <div class="flex flex-col items-center justify-center py-4">
                            <i class="fas fa-file-pdf text-6xl text-red-500 mb-4"></i>
                            <p class="font-medium">Fichier PDF</p>
                            <p class="text-sm text-gray-500">${file.name}</p>
                        </div>
                    ;
                } else if (file.type.includes('image')) {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        observationPreview.innerHTML = 
                            <img src="${e.target.result}" alt="Observation preview" class="max-w-full h-auto rounded-md">
                            <p class="text-sm text-center mt-2 text-gray-600">${file.name}</p>
                        ;
                    };
                    reader.readAsDataURL(file);
                } else {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        observationPreview.innerHTML = 
                            <div class="font-mono text-sm whitespace-pre-wrap bg-white p-3 rounded">${e.target.result}</div>
                            <p class="text-sm text-center mt-2 text-gray-600">${file.name}</p>
                        ;
                    };
                    reader.readAsText(file);
                }
            } else if (type === 'audio') {
                audioPreviewContainer.classList.remove('hidden');
                
                const reader = new FileReader();
                reader.onload = function(e) {
                    audioPreview.innerHTML = 
                        <div class="flex items-center justify-center py-2">
                            <audio controls class="w-full max-w-md">
                                <source src="${e.target.result}" type="audio/mpeg">
                                Votre navigateur ne supporte pas l'élément audio.
                            </audio>
                        </div>
                        <p class="text-sm text-center mt-2 text-gray-600">${file.name}</p>
                    ;
                };
                reader.readAsDataURL(file);
            }
        }
        
        function previewFiles(files, type) {
            if (type === 'photos') {
                photosPreviewContainer.classList.remove('hidden');
                photosPreview.innerHTML = '';
                
                files.forEach((file, index) => {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        const photoDiv = document.createElement('div');
                        photoDiv.className = 'photo-thumbnail relative group';
                        photoDiv.innerHTML = 
                            <div class="relative aspect-square overflow-hidden rounded-md bg-gray-100">
                                <img src="${e.target.result}" alt="Photo ${index + 1}" class="w-full h-full object-cover">
                                <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                                    <button class="text-white bg-red-500 rounded-full p-1 delete-photo" data-index="${index}">
                                        <i class="fas fa-trash text-xs"></i>
                                    </button>
                                </div>
                            </div>
                            <div class="mt-1 flex justify-between items-center">
                                <p class="text-xs text-gray-600 truncate">${file.name}</p>
                                <span class="text-xs bg-blue-100 text-blue-800 px-1 rounded">${index + 1}</span>
                            </div>
                        ;
                        photosPreview.appendChild(photoDiv);
                        
                        // Add delete event listener
                        const deleteBtn = photoDiv.querySelector('.delete-photo');
                        deleteBtn.addEventListener('click', (e) => {
                            e.stopPropagation();
                            deletePhoto(index);
                        });
                    };
                    reader.readAsDataURL(file);
                });
            }
        }
        
        function deletePhoto(index) {
            uploadedFiles.photos.splice(index, 1);
            
            if (uploadedFiles.photos.length > 0) {
                photosCount.textContent = ${uploadedFiles.photos.length} photo${uploadedFiles.photos.length > 1 ? 's' : ''};
                previewFiles(uploadedFiles.photos, 'photos');
            } else {
                photosCount.classList.add('hidden');
                clearPhotosBtn.classList.add('hidden');
                photosPreviewContainer.classList.add('hidden');
                checkFilesStatus();
            }
        }
        
        function clearFile(type) {
            if (type === 'observation') {
                uploadedFiles.observation = null;
                observationFileInput.value = '';
                observationFileName.classList.add('hidden');
                clearObservationBtn.classList.add('hidden');
                observationPreviewContainer.classList.add('hidden');
            } else if (type === 'photos') {
                uploadedFiles.photos = [];
                photoFilesInput.value = '';
                photosCount.classList.add('hidden');
                clearPhotosBtn.classList.add('hidden');
                photosPreviewContainer.classList.add('hidden');
            } else if (type === 'audio') {
                uploadedFiles.audio = null;
                audioFileInput.value = '';
                audioFileName.classList.add('hidden');
                clearAudioBtn.classList.add('hidden');
                audioPreviewContainer.classList.add('hidden');
            }
            
            checkFilesStatus();
        }
        
        function checkFilesStatus() {
            const hasFiles = uploadedFiles.observation || uploadedFiles.photos.length > 0 || uploadedFiles.audio;
            noFilesMessage.classList.toggle('hidden', hasFiles);
            
            // Enable/disable preview and generate buttons based on minimum requirements
            const canPreview = uploadedFiles.observation || uploadedFiles.photos.length > 0;
            previewBtn.disabled = !canPreview;
            generateBtn.disabled = !canPreview;
            
            if (!canPreview) {
                reportPreviewContainer.classList.add('hidden');
            }
        }
        
        function generatePreview() {
            if (!uploadedFiles.observation && uploadedFiles.photos.length === 0) {
                alert('Veuillez ajouter au moins une fiche d\'observation ou des photos pour générer un aperçu');
                return;
            }
            
            // Show processing animation
            progressContainer.classList.remove('hidden');
            progressBar.style.width = '30%';
            progressPercent.textContent = '30%';
            
            // Simulate processing (in a real app, this would be API calls)
            setTimeout(() => {
                progressBar.style.width = '80%';
                progressPercent.textContent = '80%';
                
                setTimeout(() => {
                    progressBar.style.width = '100%';
                    progressPercent.textContent = '100%';
                    
                    setTimeout(() => {
                        progressContainer.classList.add('hidden');
                        generateReportContent();
                        exportButtons.classList.remove('hidden');
                    }, 500);
                }, 1000);
            }, 1000);
        }
        
        function generateReport() {
            generatePreview();
        }
        
        function generateReportContent() {
            reportPreviewContainer.classList.remove('hidden');
            
            // Get form data
            const reportName = document.getElementById('report-name').value || 'Rapport de chantier';
            const siteType = document.querySelector('input[name="site-type"]:checked').value;
            const additionalNotes = document.getElementById('additional-notes').value;
            
            // Site type labels
            let siteTypeLabel = '';
            if (siteType === 'CH') siteTypeLabel = 'Contrôle Habitation';
            else if (siteType === 'CC') siteTypeLabel = 'Contrôle Construction';
            else if (siteType === 'ITV') siteTypeLabel = 'Inspection Technique';
            
            // Generate date
            const today = new Date();
            const day = String(today.getDate()).padStart(2, '0');
            const month = String(today.getMonth() + 1).padStart(2, '0');
            const year = today.getFullYear();
            const formattedDate = ${day}/${month}/${year};
            
            // Report content
            let reportHTML = 
                <div class="max-w-4xl mx-auto">
                    <!-- Header -->
                    <div class="mb-8 text-center">
                        <div class="py-4 px-6 rounded-lg" style="background-color: #0055A4; color: white;">
                            <h1 class="text-2xl font-bold">${reportName}</h1>
                            <p class="text-lg">${siteTypeLabel}</p>
                        </div>
                        <div class="mt-2 text-sm text-gray-600">
                            Généré le ${formattedDate} - CURATEC
                        </div>
                    </div>
                    
                    <!-- Summary -->
                    <div class="mb-6 p-4 border rounded-lg bg-blue-50">
                        <h2 class="text-lg font-semibold text-blue-800 mb-2">Informations rapides</h2>
                        <div class="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <p class="font-medium">Type de chantier:</p>
                                <p>${siteTypeLabel}</p>
                            </div>
                            <div>
                                <p class="font-medium">Date:</p>
                                <p>${formattedDate}</p>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Content sections -->
                    <div class="space-y-6">
                        <!-- Context Section -->
                        <div>
                            <h2 class="text-xl font-semibold border-b pb-2 mb-4" style="color: #0055A4;">
                                <i class="fas fa-map-marker-alt mr-2"></i>Contexte du chantier
                            </h2>
                            ${uploadedFiles.observation ? 
                                <div class="mb-4 p-3 bg-gray-50 rounded border">
                                    <h3 class="font-medium mb-2">Extrait de la fiche d'observation:</h3>
                                    <div class="text-sm italic">
                                        ${uploadedFiles.observation.type.includes('image') ? 
                                            '[Contenu du texte extrait de l\'image via OCR]' : 
                                            uploadedFiles.observation.type === 'application/pdf' ? 
                                            '[Contenu du texte extrait du PDF]' : 
                                            '[Contenu du fichier texte]'}
                                    </div>
                                </div>
                             : ''}
                            <div class="prose">
                                <p>Cette section décrit le contexte général du chantier, incluant son emplacement, les intervenants principaux et les caractéristiques techniques.</p>
                                <p>Le chantier a été inspecté conformément aux normes en vigueur pour le type ${siteTypeLabel}. Les observations suivantes ont été relevées durant cette visite.</p>
                            </div>
                        </div>
                        
                        <!-- Observations Section -->
                        <div>
                            <h2 class="text-xl font-semibold border-b pb-2 mb-4" style="color: #0055A4;">
                                <i class="fas fa-clipboard-check mr-2"></i>Observations de l'ouvrier
                            </h2>
                            ${uploadedFiles.audio ? 
                                <div class="mb-4 p-3 bg-gray-50 rounded border">
                                    <h3 class="font-medium mb-2">Transcription audio:</h3>
                                    <div class="text-sm italic">
                                        <p>[Transcription automatique de l'enregistrement audio via Whisper/SpeechRecognition]</p>
                                        <p class="mt-2 text-gray-500 text-xs">Transcription générée automatiquement - à vérifier</p>
                                    </div>
                                </div>
                             : ''}
                            <div class="prose">
                                <p>Les principales observations relevées lors de cette visite sont les suivantes :</p>
                                <ul class="list-disc pl-5">
                                    <li>Point d'observation 1 avec détails techniques</li>
                                    <li>Point d'observation 2 avec détails techniques</li>
                                    <li>Point d'observation 3 avec détails techniques</li>
                                </ul>
                                ${additionalNotes ? 
                                    <div class="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400">
                                        <h4 class="font-medium">Notes supplémentaires:</h4>
                                        <p>${additionalNotes}</p>
                                    </div>
                                 : ''}
                            </div>
                        </div>
            ;
            
            // Photos Section
            if (uploadedFiles.photos.length > 0) {
                reportHTML += 
                    <div>
                        <h2 class="text-xl font-semibold border-b pb-2 mb-4" style="color: #0055A4;">
                            <i class="fas fa-camera mr-2"></i>Photos
                        </h2>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                ;
                
                uploadedFiles.photos.forEach((photo, index) => {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        const imgContainer = document.createElement('div');
                        imgContainer.className = 'photo-report-container';
                        imgContainer.innerHTML = 
                            <div class="border rounded overflow-hidden">
                                <img src="${e.target.result}" alt="Photo ${index + 1}" class="w-full h-auto">
                                <div class="p-2 bg-gray-50 border-t">
                                    <p class="text-sm text-gray-700">Photo ${index + 1}: [Légende générée automatiquement]</p>
                                </div>
                            </div>
                        ;
                        reportPreview.querySelector('.grid.gap-4').appendChild(imgContainer);
                    };
                    reader.readAsDataURL(photo);
                    
                    reportHTML += 
                        <div class="border rounded overflow-hidden">
                            <img src="" alt="Photo ${index + 1}" class="w-full h-auto" id="photo-report-${index}">
                            <div class="p-2 bg-gray-50 border-t">
                                <p class="text-sm text-gray-700">Photo ${index + 1}: [Légende générée automatiquement]</p>
                            </div>
                        </div>
                    ;
                });
                
                reportHTML += 
                        </div>
                    </div>
                ;
            }
            
            // Final Synthesis
            reportHTML += 
                        <div>
                            <h2 class="text-xl font-semibold border-b pb-2 mb-4" style="color: #0055A4;">
                                <i class="fas fa-check-circle mr-2"></i>Synthèse finale
                            </h2>
                            <div class="prose">
                                <p>En synthèse, ce chantier présente les caractéristiques suivantes :</p>
                                <ul class="list-disc pl-5">
                                    <li>Point positif 1</li>
                                    <li>Point à améliorer 1</li>
                                    <li>Recommandation principale</li>
                                </ul>
                                <div class="mt-4 p-4 rounded" style="background-color: #0055A4; color: white;">
                                    <h3 class="font-bold text-lg mb-2">Conclusion</h3>
                                    <p>Le chantier est conforme aux attentes avec des réserves mineures concernant [détails]. Une visite de suivi est recommandée dans [délai].</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Footer -->
                    <div class="mt-8 pt-4 border-t text-sm text-gray-600 text-center">
                        <p>Rapport généré automatiquement par le système CURATEC - ${formattedDate}</p>
                        <p class="mt-1">© ${year} CURATEC - Tous droits réservés</p>
                    </div>
                </div>
            ;
            
            reportPreview.innerHTML = reportHTML;
            
            // Load photos in the report
            if (uploadedFiles.photos.length > 0) {
                uploadedFiles.photos.forEach((photo, index) => {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        const imgElement = reportPreview.querySelector(#photo-report-${index});
                        if (imgElement) {
                            imgElement.src = e.target.result;
                        }
                    };
                    reader.readAsDataURL(photo);
                });
            }
        }
        
        function exportReport(format) {
            // Simulate processing
            progressContainer.classList.remove('hidden');
            progressBar.style.width = '0%';
            progressPercent.textContent = '0%';
            
            let progress = 0;
            const interval = setInterval(() => {
                progress += 10;
                progressBar.style.width = ${progress}%;
                progressPercent.textContent = ${progress}%;
                
                if (progress >= 100) {
                    clearInterval(interval);
                    setTimeout(() => {
                        progressContainer.classList.add('hidden');
                        
                        // Create a fake download
                        const fileName = document.getElementById('report-name').value || 'rapport_curatec';
                        const extension = format === 'pdf' ? 'pdf' : 'docx';
                        const blob = new Blob(['Contenu du rapport'], { type: format === 'pdf' ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = ${fileName}.${extension};
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        URL.revokeObjectURL(url);
                        
                        // Show success message
                        alert(Rapport exporté avec succès au format ${format.toUpperCase()} !);
                    }, 500);
                }
            }, 100);
        }
        
        function openFullscreenPreview() {
            fullscreenModal.classList.remove('hidden');
            fullscreenPreviewContent.innerHTML = reportPreview.innerHTML;
            document.body.style.overflow = 'hidden';
        }
        
        function closeFullscreenPreview() {
            fullscreenModal.classList.add('hidden');
            document.body.style.overflow = '';
        }
