const searchButton = document.getElementById('search-button');
        const searchInput = document.getElementById('search');
        const searchResults = document.getElementById('search-results');
        const playlist = document.getElementById('playlist');
        let playlistArray = [];
        let currentAudio = null;

        searchButton.addEventListener('click', () => {
            const query = searchInput.value;
            fetch(`https://v1.nocodeapi.com/thehrk03/spotify/ZKqWRIiwkFjDeQCJ/search?q=${encodeURIComponent(query)}&type=track`)
                .then(response => response.json())
                .then(data => {
                    searchResults.innerHTML = '';
                    const tracks = data.tracks.items;
                    tracks.forEach(track => {
                        const trackElement = document.createElement('div');
                        trackElement.classList.add('col-md-3');
                        trackElement.classList.add('mt-5');
                        trackElement.innerHTML = `
                            <div class="card rounded-4 mb-3 bg-dark text-white shadow">
                                <img src="${track.album.images[1].url}" class="card-img-top img-fluid rounded-4" alt="${track.name}">
                                <div class="card-body">
                                    <h5 class="card-title">${track.name}</h5>
                                    <p class="card-text">By ${track.artists.map(artist => artist.name).join(', ')}</p>
                                    <button class="btn btn-outline-success mb-2 btn-play" data-url="${track.preview_url}">Play Preview</button>
                                    <button class="btn btn-outline-warning mb-2 btn-add" data-track='${JSON.stringify(track)}'>Add to Playlist</button>
                                    <div class="audio-controls">
                                        <audio controls>
                                            <source src="${track.preview_url}" type="audio/mpeg">
                                            Your browser does not support the audio element.
                                        </audio>
                                    </div>
                                </div>
                            </div>
                        `;
                        searchResults.appendChild(trackElement);
                    });
                })
                .catch(error => console.log('Error:', error));
        });

        searchResults.addEventListener('click', event => {
            if (event.target.classList.contains('btn-play')) {
                const url = event.target.getAttribute('data-url');
                const cardBody = event.target.closest('.card-body');
                const audioControls = cardBody.querySelector('.audio-controls');
                const audioElement = audioControls.querySelector('audio');

                if (currentAudio && currentAudio !== audioElement) {
                    currentAudio.pause();
                    currentAudio.currentTime = 0;
                }

                //This is to Hide previous audio controls
                const previousAudioControls = document.querySelector('.audio-controls');
                if (previousAudioControls && previousAudioControls !== audioControls) {
                    previousAudioControls.style.display = 'none';
                }

                //This is to Update the audio source and show controls
                audioElement.src = url;
                audioControls.style.display = 'block';
                audioElement.play();

                //This is to Set current audio
                currentAudio = audioElement;
            } else if (event.target.classList.contains('btn-add')) {
                const track = JSON.parse(event.target.getAttribute('data-track'));
                if (!playlistArray.some(item => item.id === track.id)) {
                    playlistArray.push(track);
                    updatePlaylist();
                }
            }
        });

        function updatePlaylist() {
            playlist.innerHTML = '';
            playlistArray.forEach(track => {
                const playlistItem = document.createElement('div');
                playlistItem.classList.add('playlist-item');
                playlistItem.classList.add('bg-dark');
                playlistItem.innerHTML = `
                    <img src="${track.album.images[1].url}" alt="${track.name}">
                    <div>
                        <strong>${track.name}</strong><br>
                        <small>By ${track.artists.map(artist => artist.name).join(', ')}</small>
                    </div>
                    <div>
                        <button class="btn btn-success btn-play mb-2" data-url="${track.preview_url}">Play</button>
                        <button class="btn btn-danger mb-2 btn-remove" data-id="${track.id}">Remove</button>
                        <div class="audio-controls">
                            <audio controls>
                                <source src="${track.preview_url}" type="audio/mpeg">
                                Your browser does not support the audio element.
                            </audio>
                        </div>
                    </div>
                `;
                playlist.appendChild(playlistItem);
            });
        }

        playlist.addEventListener('click', event => {
            if (event.target.classList.contains('btn-remove')) {
                const trackId = event.target.getAttribute('data-id');
                playlistArray = playlistArray.filter(track => track.id !== trackId);
                updatePlaylist();
            } else if (event.target.classList.contains('btn-play')) {
                const url = event.target.getAttribute('data-url');
                const playlistItem = event.target.closest('.playlist-item');
                const audioControls = playlistItem.querySelector('.audio-controls');
                const audioElement = audioControls.querySelector('audio');

                if (currentAudio && currentAudio !== audioElement) {
                    currentAudio.pause();
                    currentAudio.currentTime = 0;
                }

                //This is to Update the audio source and show controls
                audioElement.src = url;
                audioControls.style.display = 'block';
                audioElement.play();

                //this is to Set current audio
                currentAudio = audioElement;
            }
        });