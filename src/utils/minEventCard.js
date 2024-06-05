getMinEventCardIconSrc = (eventType) => {
   return `../img/minEventCard/icon/${eventType.substring(0, 2)}.png`;
};
getMinEventCardBgSrc = (eventType) => {
   return `../img/minEventCard/bg/${eventType.substring(0, 2)}${
      Math.floor(Math.random() * 3) + 1
   }.jpg`;
};

module.exports = { getMinEventCardIconSrc, getMinEventCardBgSrc };
