const arrayOfLikes = (blogs) => blogs.map(item => item.likes)
const dummy = (blogs) => {
  // ...
  return 1
}

const totalLikes = (blogs) => {
  const likesArray = arrayOfLikes(blogs)
  const reducer = (accumulator, currentValue) => accumulator + currentValue;
  return likesArray.length > 0 && likesArray !== "undefined"
              ? likesArray.reduce(reducer)
              : 0
}

const favouriteBlog = (blogs) => {
  const likesArray = arrayOfLikes(blogs)
  if (likesArray.length === 0 || likesArray === "undefined") {
    return 0
  }

  const maxLikes = Math.max.apply(null, likesArray)
  const favourBlog = blogs[likesArray.indexOf(maxLikes)]

  return {
    title: favourBlog.title,
    author: favourBlog.author,
    likes: favourBlog.likes
  }
}

// Можно с Lodash
// const mostBlogs
//  Определите функцию с именем mostBlogs, которая получает массив блогов в качестве параметра. Функция возвращает автора , у которого больше всего блогов. Возвращаемое значение также содержит количество блогов, которые ведет ведущий автор:

// const mostLikes
//  Определите функцию с именем mostLikes, которая принимает в качестве параметра массив блогов. Функция возвращает автора, чьи сообщения в блоге набирают наибольшее количество лайков. Возвращаемое значение также содержит общее количество лайков, которые получил автор:

module.exports = {
  dummy,
  totalLikes,
  favouriteBlog
}