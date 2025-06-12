const account = {
  displayName: "Jaydon Frankie",
  email: "demo@minimals.cc",
  photoURL: "/img/avatar_default.jpg",
};

// arrays of users
const users = Array.from({ length: 20 }, (_, i) => ({
  id: crypto.randomUUID(),
  username: `user${i + 1}`,
  firstName: `First${i + 1}`,
  lastName: `Last${i + 1}`,
  avatar: "/img/avatar_default.jpg",
  hasFollowedBack: Math.random() < 0.5,
  isOnline: Math.random() < 0.5,
  isVerified: Math.random() < 0.3,
}));

users.push({
  id: "dd01ecbe-f798-4fb5-a56a-184c4ba9e023",
  username: "user21",
  firstName: "First21",
  lastName: "Last21",
  avatar: "/img/avatar_default.jpg",
  hasFollowedBack: Math.random() < 0.5,
  isOnline: Math.random() < 0.5,
  isVerified: Math.random() < 0.3,
});

export { account, users };
