import Category from "../models/Category.js";
import Book from "../models/Book.js";

export async function index(req, res) {
    let fiveCategories = []
    if(!req.session.isLoggedIn) {
        fiveCategories = await Category.find()
            .sort({ numberClicks: -1 })
            .limit(2);
    }
    const booksPerCategories = await Promise.all(
        fiveCategories.map(async (category) => {
            // Encuentra los seis libros más clickeados para la categoría actual
            const books = await Book.find({ categories: { $in: [category.name] } }) // Busca si la categoría está en el array
                .sort({ numberClicks: -1 }) // Ordenar por el número de clics en orden descendente
                .limit(6); // Limitar el resultado a los 6 libros más clickeados

            return {
                category: category.name,
                books, // Libros de esta categoría
            };
        })
    );




    res.render('index', {
        pageTitle: 'Tienda Katfer',
        categories: booksPerCategories
    });
}

export async function addToCart(req, res) {
    try {
        if(!req.session.isLoggedIn) {
            return res.render('login', {
                pageTitle: "Please login",
                msg: 'To add to cart, please first login'
            })
        }
        const { id } = req.body
        const book = await Book.findById(id)
        if(!book)
            return res.redirect('/');
        console.log(req.session.user)
        const result = await req.session.user.addToCart(book)
        res.redirect('/');
    } catch (error) {

    }
}