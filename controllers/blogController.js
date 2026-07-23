exports.index = async(req,res)=>{

    const blogs = await blogService.getBlogs({

        search:req.query.search || "",

        status:req.query.status || "ALL"

    });

    res.render("admin/blogs/index",{

        blogs,

        filters:req.query

    });

}