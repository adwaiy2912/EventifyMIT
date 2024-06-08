getEventIconSrc = (eventType) => {
   return `../img/minEventCard/icon/${eventType.substring(0, 2)}.png`;
};
getEventBgSrc = (eventType, eventName) => {
   return `../img/minEventCard/bg/${eventType.substring(0, 2)}${
      (eventName.length % 3) + 1
   }.jpg`;
};

module.exports = { getEventIconSrc, getEventBgSrc };
