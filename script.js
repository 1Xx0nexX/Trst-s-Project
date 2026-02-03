// 1. ใช้ CDN เพื่อแก้ Error "Failed to resolve module" ที่เจอใน Console
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// 2. ข้อมูล Config (ตรวจสอบ apiKey ว่าไม่มีเว้นวรรค)
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


const signupForm = document.getElementById('signupForm');
if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // ป้องกันหน้ารีเฟรชเอง
        
        // ดึงค่า .value ออกมา (แก้ Error scalar field ที่คุณเคยเจอ)
        const username = document.getElementById('reg-username').value;
        const email = document.getElementById('reg-email').value;
        const password = document.getElementById('reg-password').value;

        try {
            // สร้างบัญชีใน Firebase Auth
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // บันทึก Username ลง Firestore
            await setDoc(doc(db, "users", user.uid), {
                username: username,
                email: email,
                uid: user.uid,
                createdAt: new Date()
            });

            // แสดง Popup เมื่อสำเร็จ
            document.getElementById('successPopup').classList.add('active');

        } catch (error) {
            console.error(error);
            alert("สมัครไม่สำเร็จ: " + error.message);
        }
    });
}

// 4. ตั้งค่าให้ปุ่ม "ตกลง" ใน Popup เปลี่ยนหน้าไป Login
const btnDone = document.getElementById('btn-done');
if (btnDone) {
    btnDone.addEventListener('click', () => {
        window.location.href = "login.html"; 
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