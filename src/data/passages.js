export const passages = [
  "The quick brown fox jumps over the lazy dog. Learning to type faster requires regular practice and patience. Focus on accuracy first and speed will naturally improve over time.",

  "Technology continues to change the way people work and communicate. Good software is built with clean code, careful planning, testing, and continuous improvement.",

  "Programming is a skill that becomes stronger through consistent practice. Every problem you solve teaches you something new and helps you become a better developer.",

  "Success in software development comes from understanding fundamentals and building real projects. Practice every day, learn from mistakes, and keep improving your skills.",

  "A typing speed test measures how quickly and accurately you can enter text. The best results come from maintaining a steady rhythm while avoiding unnecessary mistakes."
];

export const getRandomPassage = () => {
  const index = Math.floor(Math.random() * passages.length);

  return passages[index];
};