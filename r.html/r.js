document.getElementById('spinButton').addEventListener('click', () => {
    const input = document.getElementById('inputValues').value;
    if (!input) {
        alert('กรุณาใส่ข้อมูลเพื่อสุ่ม');
        return;
    }

    const values = input.split(',').map(value => value.trim());
    drawWheel(values);
    spinWheel(values);
});

function drawWheel(values, rotation = 0) {
    const canvas = document.getElementById('wheelCanvas');
    const ctx = canvas.getContext('2d');
    const radius = canvas.width / 2;
    const numSegments = values.length;
    const angleStep = (2 * Math.PI) / numSegments;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < numSegments; i++) {
        // วาดแต่ละส่วนของวงล้อ
        ctx.beginPath();
        ctx.moveTo(radius, radius);
        ctx.arc(radius, radius, radius, i * angleStep + rotation, (i + 1) * angleStep + rotation);
        ctx.fillStyle = i % 2 === 0 ? '#FFD700' : '#FF8C00'; // สีสลับกัน
        ctx.fill();
        ctx.stroke();

        // วาดข้อความในแต่ละส่วน
        ctx.save();
        ctx.translate(radius, radius);
        ctx.rotate(i * angleStep + rotation + angleStep / 2);
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#000'; // สีข้อความ
        ctx.font = 'bold 16px Arial'; // ขนาดฟอนต์

        // วาดข้อความที่ตำแหน่งเหมาะสม
        ctx.fillText(values[i], radius * 0.6, 0);
        ctx.restore();
    }
}

function spinWheel(values) {
    const canvas = document.getElementById('wheelCanvas');
    const ctx = canvas.getContext('2d');
    let angle = 0;
    const spinDuration = 5000; // ระยะเวลาหมุนในมิลลิวินาที
    const numSegments = values.length;
    const segmentAngle = (2 * Math.PI) / numSegments;

    // คำนวณมุมหยุดที่ทำให้วงล้อหยุดตรงกับผลลัพธ์ที่เลือก
    const selectedIndex = Math.floor(Math.random() * numSegments);
    const spinEndAngle = (2 * Math.PI * 10) + ((numSegments - selectedIndex) * segmentAngle) - (segmentAngle / 2); // หมุนหลายรอบก่อนหยุดที่ผลลัพธ์

    const startTime = Date.now();

    function animate() {
        const currentTime = Date.now();
        const elapsed = currentTime - startTime;

        if (elapsed < spinDuration) {
            // เพิ่มมุมหมุนตามเวลา
            angle = (spinEndAngle * (elapsed / spinDuration)) % (2 * Math.PI);
            drawWheel(values, angle);
            requestAnimationFrame(animate);
        } else {
            // หยุดที่มุมที่ทำให้วงล้อหยุดตรงกับผลลัพธ์
            drawWheel(values, spinEndAngle % (2 * Math.PI));
            document.getElementById('resultDisplay').textContent = `ผลลัพธ์: ${values[selectedIndex]}`;
        }
    }

    animate();
}
