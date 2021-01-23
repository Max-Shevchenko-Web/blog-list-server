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

const mostBlogs = blogs => {
  const authors = {};
  let mostBlogsValue = 0;
  let authorWithMostBlogs = null;

  if (!blogs.length) return null;

  blogs.forEach(blog => {
    if (authors.hasOwnProperty(blog.author)) {
      authors[blog.author]++;
    } else {
      authors[blog.author] = 1;
    }
  });

  for (author of Object.keys(authors)) {
    if (authors[author] > mostBlogsValue) {
      authorWithMostBlogs = author;
      mostBlogsValue = authors[author];
    }
  }

  return {
    author: authorWithMostBlogs,
    blogs: mostBlogsValue
  };
};

const mostLikes = blogs => {
  const authors = {};
  let mostLikesValue = 0;
  let authorWithMostLikes = null;

  if (!blogs.length) return null;

  blogs.forEach(blog => {
    if (authors.hasOwnProperty(blog.author)) {
      authors[blog.author] += blog.likes;
    } else {
      authors[blog.author] = blog.likes;
    }
  });

  for (author of Object.keys(authors)) {
    if (authors[author] > mostLikesValue) {
      authorWithMostLikes = author;
      mostLikesValue = authors[author];
    }
  }

  return {
    author: authorWithMostLikes,
    likes: mostLikesValue
  };
};

module.exports = {
  dummy,
  totalLikes,
  favouriteBlog
}
