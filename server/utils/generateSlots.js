const generateSlots = (daysAhead = 7) => {
    const slots = [];
    const now = new Date();
  
    for (let d = 0; d < daysAhead; d++) {
      const date = new Date(now);
      date.setDate(now.getDate() + d);
  
      for (let hour = 9; hour < 18; hour++) {
        if (hour === 13) continue; // Skip 1-2pm
  
        for (let min = 0; min < 60; min += 30) {
          const slot = new Date(date.setHours(hour, min, 0, 0));
  
          // 2-hour buffer check
          if (slot > new Date(Date.now() + 2 * 60 * 60 * 1000)) {
            const slotInIST = slot.toLocaleString("en-IN", {
              timeZone: "Asia/Kolkata",
              hour12: false
            });
            slots.push(slotInIST);
          }
        }
      }
    }
    return slots;
  };

module.exports = generateSlots;