const featuredBlogs = await blogService.getFeaturedBlogs();

res.render("home", {

    featuredBlogs

});