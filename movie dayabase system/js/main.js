
// swiper
var swiper = new Swiper(".popular-content", {
    slidesPerView:1,
    spaceBetween:10,
    autoplay: {
      delay:5500,
      disableOnInteraction: false,
    },
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    breakpoints:{
        280:{
            slidesPerView:1,
            spaceBetween:10,
        },
        320:{
            slidesPerView:2,
            spaceBetween:10,
        },
        510:{
            slidesPerView:2,
            spaceBetween:10,
        },    
        758:{
            slidesPerView:3,
            spaceBetween:15,
        },
        900:{
            slidesPerView:4,
            spaceBetween:20,
        },         
    },
});
// show video
let playButton=document.querySelector(".play-movie");
let video=document.querySelector(".video-container");
let myvideo=document.querySelector("#myvideo");
let closebtn=document.querySelector(".close-video");

playButton.onclick = () => {
    video.classList.add("show-video");
    // autoplay when click on button
    myvideo.play();
};


closebtn.onclick = () => {
    video.classList.remove("show-video");
    // autoplay when click on button
    myvideo.pause();
};
// Chatbot Logic + Speech-to-Text (Responsive Version)
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const chatbotToggle = document.getElementById('chatbot-toggle');
    const chatbotContainer = document.querySelector('.chatbot-container');
    const closeChatbot = document.getElementById('close-chatbot');
    const micButton = document.getElementById('mic-button');
    const sendButton = document.getElementById('send-button');
    const userInput = document.getElementById('user-input');
    const chatbotMessages = document.getElementById('chatbot-messages');

    // Toggle Chatbot
    chatbotToggle.addEventListener('click', () => {
        chatbotContainer.classList.toggle('active');
    });

    closeChatbot.addEventListener('click', () => {
        chatbotContainer.classList.remove('active');
    });

    // Responsive adjustments
    function adjustChatbotSize() {
        if (window.innerWidth < 768) {
            chatbotContainer.style.width = '90vw';
            chatbotContainer.style.height = '60vh';
            chatbotContainer.style.bottom = '70px'; // Avoid overlap with toggle button
        } else {
            chatbotContainer.style.width = '350px';
            chatbotContainer.style.height = '500px';
            chatbotContainer.style.bottom = '20px';
        }
    }

    // Initial adjustment
    adjustChatbotSize();
    window.addEventListener('resize', adjustChatbotSize);

    // Speech Recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.lang = 'en-US';
        recognition.interimResults = false;

        micButton.addEventListener('click', () => {
            try {
                recognition.start();
                micButton.classList.add('listening');
                addBotMessage("Listening...");
            } catch (e) {
                addBotMessage("Microphone access denied. Please allow permissions.");
                micButton.classList.remove('listening');
            }
        });

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            userInput.value = transcript;
            micButton.classList.remove('listening');
            handleUserQuery(transcript); // Fixed typo (was 'transcript')
        };

        recognition.onerror = (event) => {
            micButton.classList.remove('listening');
            addBotMessage("Error: " + event.error);
        };
    } else {
        micButton.style.display = 'none';
        addBotMessage("Voice commands not supported in your browser. Try Chrome or Edge.");
    }

    // Input handling (optimized)
    function processInput() {
        const query = userInput.value.trim();
        if (query) {
            handleUserQuery(query);
            userInput.value = '';
        }
    }

    sendButton.addEventListener('click', processInput);
    userInput.addEventListener('keypress', (e) => e.key === 'Enter' && processInput());

    // Enhanced movie search function
    function searchMovies(query) {
        const lowerQuery = query.toLowerCase();
        
        // Get all movie elements from the page
        const movieBoxes = document.querySelectorAll('.movie-box');
        const matchedMovies = [];
        
        movieBoxes.forEach(movie => {
            const title = movie.querySelector('.movie-title').textContent.toLowerCase();
            const genre = movie.querySelector('.movie-type').textContent.toLowerCase();
            
            if (title.includes(lowerQuery) || genre.includes(lowerQuery)) {
                matchedMovies.push(movie.querySelector('.movie-title').textContent);
            }
        });
        
        return matchedMovies;
    }

    // Process User Query
    function handleUserQuery(query) {
        addUserMessage(query);
        
        const lowerQuery = query.toLowerCase();
        let response = "";
        
        // Enhanced responses
        if (lowerQuery.includes('action')) {
            const movies = searchMovies('action');
            response = movies.length > 0 
                ? `Action movies: ${movies.join(', ')}` 
                : "No action movies found.";
        } 
        else if (lowerQuery.includes('comedy') || lowerQuery.includes('funny')) {
            const movies = searchMovies('comedy');
            response = movies.length > 0 
                ? `Comedy movies: ${movies.join(', ')}` 
                : "No comedies found.";
        }
        else if (lowerQuery.match(/(hi|hello|hey)/)) {
            response = "Hello! Try asking: 'Show action movies', 'Find comedies', or search by title.";
        }
        else {
            // Search for any matching movies
            const movies = searchMovies(lowerQuery);
            response = movies.length > 0 
                ? `Found: ${movies.join(', ')}` 
                : "I couldn't find matching movies. Try being more specific.";
        }
        
        addBotMessage(response);
        
        // Optional: Auto-scroll to movie results
        if (response.includes("movies:")) {
            setTimeout(() => {
                document.querySelector('.movies').scrollIntoView({ behavior: 'smooth' });
            }, 500);
        }
    }

    // Helper functions
    function addUserMessage(text) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('user-message');
        messageDiv.textContent = text;
        chatbotMessages.appendChild(messageDiv);
        scrollToBottom();
    }

    function addBotMessage(text) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('bot-message');
        messageDiv.textContent = text;
        chatbotMessages.appendChild(messageDiv);
        scrollToBottom();
    }

    function scrollToBottom() {
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }
});