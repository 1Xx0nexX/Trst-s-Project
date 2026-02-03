import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

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

// เช็คสถานะการเข้าใช้งาน
onAuthStateChanged(auth, async (user) => {
    if (user) {
        try {
            const userRef = doc(db, "users", user.uid);
            const userSnap = await getDoc(userRef);

            if (userSnap.exists()) {
                const userData = userSnap.data();
                
                // ดึง id ให้ตรงกับใน HTML ของคุณ
                const nameDisplay = document.getElementById('display-username');
                const balanceDisplay = document.getElementById('display-balance');

                if (nameDisplay) {
                    nameDisplay.innerText = userData.username || "User";
                }
                
                if (balanceDisplay) {
                    const balance = userData.balance || 0;
                    balanceDisplay.innerText = balance.toLocaleString(undefined, {minimumFractionDigits: 2});
                }
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    } else {
        // ถ้าไม่ได้ Login ให้กลับไปหน้า Login
        // เช็ค pathname เพื่อป้องกันการ Redirect วนลูป
        if (!window.location.pathname.includes("login.html") && !window.location.pathname.includes("index.html")) {
            window.location.href = "login.html";
        }
    }
});

// ส่งฟังก์ชัน Logout ออกไปที่หน้าต่างหลัก (window) เพื่อให้ปุ่มใน HTML เรียกใช้ได้
window.handleLogout = () => {
    signOut(auth).then(() => {
        window.location.href = "login.html";
    }).catch((error) => {
        console.error("Logout Error:", error);
    });
};

// ฟังก์ชันเปิดเติมเงิน (ถ้ายังไม่ได้เขียนเพิ่ม)
window.openTopup = () => {
    alert("ระบบเติมเงินกำลังพัฒนา...");
};

