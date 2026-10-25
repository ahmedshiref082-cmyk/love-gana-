
/* =====================================
   JANA — A Letter From The Heart 💗
===================================== */

const welcomeScreen = document.getElementById("welcomeScreen");
const letterScreen = document.getElementById("letterScreen");

const openLetterButton = document.getElementById("openLetterButton");
const replayButton = document.getElementById("replayButton");

const letterContent = document.getElementById("letterContent");
const letterSignature = document.getElementById("letterSignature");
const typingCursor = document.getElementById("typingCursor");

const canvas = document.getElementById("particlesCanvas");
const ctx = canvas.getContext("2d");

// الرسالة الخاصة بجنونتي 💗
const message = [
    "يا أجمل بنوتة في الدنيا، يا جنونتي بتاعتي 💗🎀\n\n",

    "عيونك حلوين بطريقة مش طبيعية، وابتسامتك تجنن، وضحكتك من أحلى الأصوات اللي ممكن أسمعها. 🥹💗\n\n",

    "وشك القمر ده، وخدودك الكيوت، ورقتك، وطريقتك في الكلام، وكل تفصيلة صغيرة فيكي بتخلّيكي مميزة عندي.\n\n",

    "بحب أشوفك مبسوطة، وبحب ضحكتك، وبحب كل حاجة بتخلّيكي إنتِ، لأنك بالنسبالي مش شبه حد، إنتِ ليكي جمالك الخاص اللي مفيش حد يقدر يقلّده. 🎀\n\n",

    "يا روحي، يا أحلى جنونتي، أتمنى أشوفك دايمًا بتضحكي، وعينيكي مليانين فرحة، وقلبك مرتاح. إنتِ تستاهلي كل الحاجات الحلوة اللي في الدنيا. 💗🧸\n\n",

    "بحبك يا بنوتي الحلوة، يا أحلى جزء في أيامي. 💋💕"
].join("");

let typingTimer = null;
let animationFrame = null;
let particles = [];
let opened = false;
let lastTime = 0;

// فتح الرسالة
function openLetter() {
    if (opened) return;

    opened = true;
    openLetterButton.disabled = true;

    welcomeScreen.hidden = true;
    letterScreen.hidden = false;

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

    createHeartBurst();
    startTyping();
}

// كتابة الرسالة حرفًا حرفًا
function startTyping() {
    clearTimeout(typingTimer);

    letterContent.textContent = "";
    letterSignature.hidden = true;
    replayButton.hidden = true;
    typingCursor.hidden = false;

    let index = 0;

    function typeNextCharacter() {
        if (index >= message.length) {
            typingCursor.hidden = true;
            letterSignature.hidden = false;
            replayButton.hidden = false;

            createHeartBurst();
            return;
        }

        const character = message.charAt(index);
        letterContent.textContent += character;
        index++;

        // الوقوف لحظة أطول عند نهاية الجمل
        let delay = 38;

        if (character === "\n") {
            delay = 150;
        } else if ([".", "!", "؟", "،"].includes(character)) {
            delay = 220;
        }

        // تمرير الصفحة بلطف أثناء ظهور الكلام
        if (index % 8 === 0) {
            const nearBottom =
                window.innerHeight + window.scrollY >=
                document.documentElement.scrollHeight - 100;

            if (nearBottom) {
                window.scrollTo({
                    top: document.documentElement.scrollHeight,
                    behavior: "smooth"
                });
            }
        }

        typingTimer = setTimeout(typeNextCharacter, delay);
    }

    typeNextCharacter();
}

// إعادة قراءة الرسالة
function replayLetter() {
    startTyping();

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

// إعداد لوحة الجزيئات
function resizeCanvas() {
    const ratio = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = Math.floor(window.innerWidth * ratio);
    canvas.height = Math.floor(window.innerHeight * ratio);

    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;

    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
}

// إنشاء قلوب وجزيئات وردية
function createHeartBurst() {
    const colors = [
        "#ff78b7",
        "#ffc1df",
        "#ff9bc9",
        "#ffffff",
        "#ff4f9a"
    ];

    const centerX = window.innerWidth / 2;
    const centerY = Math.max(100, window.innerHeight * 0.3);

    for (let i = 0; i < 55; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 3 + 1;

        particles.push({
            x: centerX,
            y: centerY,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            size: Math.random() * 3 + 1,
            life: 1,
            color: colors[Math.floor(Math.random() * colors.length)],
            heart: Math.random() > 0.75
        });
    }
}

// رسم القلوب والجزيئات
function animateParticles(timestamp = 0) {
    const delta = lastTime ? Math.min((timestamp - lastTime) / 16.67, 2) : 1;
    lastTime = timestamp;

    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    particles = particles.filter(particle => particle.life > 0);

    for (const particle of particles) {
        particle.x += particle.vx * delta;
        particle.y += particle.vy * delta;

        particle.vx *= Math.pow(0.985, delta);
        particle.vy *= Math.pow(0.985, delta);
        particle.life -= 0.009 * delta;

        ctx.save();
        ctx.globalAlpha = Math.max(0, particle.life);
        ctx.fillStyle = particle.color;
        ctx.shadowColor = particle.color;
        ctx.shadowBlur = 12;

        if (particle.heart) {
            ctx.font = `${particle.size * 5}px sans-serif`;
            ctx.textAlign = "center";
            ctx.fillText("♥", particle.x, particle.y);
        } else {
            ctx.beginPath();
            ctx.arc(
                particle.x,
                particle.y,
                particle.size,
                0,
                Math.PI * 2
            );
            ctx.fill();
        }

        ctx.restore();
    }

    animationFrame = requestAnimationFrame(animateParticles);
}

// تشغيل الأزرار
openLetterButton.addEventListener("click", openLetter);
replayButton.addEventListener("click", replayLetter);

// تشغيل الخلفية
resizeCanvas();
window.addEventListener("resize", resizeCanvas);
animateParticles();

// تنظيف المؤقتات عند مغادرة الصفحة
window.addEventListener("pagehide", () => {
    clearTimeout(typingTimer);
    cancelAnimationFrame(animationFrame);
});
