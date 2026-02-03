import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// 1. Config ของคุณ
const firebaseConfig = {
  apiKey: "AIzaSyC5A2wsjTVNBi9A5JTDw_sGzxnoBKEclBw", 
  authDomain: "trst-675d0.firebaseapp.com",
  projectId: "trst-675d0",
  storageBucket: "trst-675d0.firebasestorage.app",
  messagingSenderId: "938222353011",
  appId: "1:938222353011:web:fa510d745562e7c56ac806",
  measurementId: "G-MVPDWCXERZ"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);


// --- ส่วนที่ 2: ฟังก์ชันนับถอยหลัง ---
function startCountdown() {
    let timeLeft = 3;
    const countdownElement = document.getElementById('countdown-text');
    
    const timer = setInterval(() => {
        timeLeft--;
        if (countdownElement) {
            countdownElement.innerText = timeLeft;
        }
        
        if (timeLeft <= 0) {
            clearInterval(timer);
           
            window.location.href = "home.html"; 
        }
    }, 1000);
}

// --- ส่วนที่ 3: จัดการการ Login ---
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // ดึงชื่อมาแสดงใน Popup
            const userDoc = await getDoc(doc(db, "users", user.uid));
            if (userDoc.exists()) {
                const userData = userDoc.data();
                const welcomeMsg = document.getElementById('welcome-message');
                if (welcomeMsg) welcomeMsg.innerText = `ยินดีต้อนรับคุณ ${userData.username}!`;
            }

            // แสดง Popup
            const popup = document.getElementById('loginSuccessPopup');
            if (popup) {
                popup.classList.add('active'); // ตรวจสอบว่าใน style.css มี .popup-overlay.active { display: flex; }
                startCountdown();
            } else {
                // ถ้าหา Popup ไม่เจอ ให้เด้งไปหน้า home ทันที ไม่ต้องรอ
                window.location.href = "home.html";
            }

        } catch (error) {
            console.error("Login Error:", error);
            alert("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
        }
    });
}
/*================= ลอยๆ =================*/

const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');
let particlesArray = [];

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

class Particle {
    constructor() { this.init(); }
    init() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + 50;
        this.size = Math.random() * 2 + 0.5;
        this.speedY = Math.random() * 0.5 + 0.2;
        this.opacity = 0;
    }
    update() {
        this.y -= this.speedY;
        if (this.y > canvas.height - 100) this.opacity += 0.01;
        if (this.y < 100) this.opacity -= 0.01;
        if (this.y < 0 || this.opacity <= 0) this.init();
    }
    draw() {
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}
function initParticles() { for (let i = 0; i < 70; i++) particlesArray.push(new Particle()); }
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particlesArray.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animate);
}
initParticles();
animate();

