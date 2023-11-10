const router = require("express").Router();
const passport = require("passport");

router.get("/", (req, res, next) => {
  res.render("index");
});

router.get("/signup", isAuthenticated,(req, res, next) => {
  res.render("signup");
});

router.post("/signup", passport.authenticate("local-signup", {
    successRedirect: "/admin",
    failureRedirect: "/signup",
    failureFlash: true,
  })
);

router.get("/signin", (req, res, next) => {
  res.render("signin");
});

router.post("/signin", passport.authenticate("local-signin", {
    successRedirect: "/invent",
    failureRedirect: "/signin",
    failureFlash: true,
  })
);

router.get("/index", (req, res, next) => {
  res.render("index");
});

router.get("/logout", (req, res, next) => {
  req.logout();
  res.redirect("/");
});

router.get("/invent", isAuthenticated, async (req, res, next) => {
  const Producto = require("../models/lista_invent");
  try {
    const productos = await Producto.find({});
    const totalproducts = productos.length;
    const sumaCant = productos.reduce(
      (total, producto) => total + producto.cant,
      0
    );
    const dinero = productos.reduce(
      (total, producto) => total + producto.price,
      0
    );

    const sumaTotDinero = productos.reduce(
      (total, producto) => total + producto.cant*producto.price, 0
    );

    // Formatear las fechas en cada producto
    productos.forEach((producto) => {
      producto.fech = producto.fech.toDateString(); // Transforma la fecha sin hora
    });

    res.render("invent", {
      productos: productos,
      totalproducts: totalproducts,
      sumaCant: sumaCant,
      dinero: dinero,
      sumaTotDinero: sumaTotDinero
    });
  } catch (error) {
    console.error(error);
    res.render("error", {
      errorMessage: "Error al obtener la lista de productos.",
    });
  }
});

router.get("/newP", isAuthenticated, (req, res, next) => {
  res.render("newP", {
    successMessage: req.flash("successMessage"),
    errorMessage: req.flash("errorMessage"),
  });
});

router.post("/newP", isAuthenticated, async (req, res, next) => {
  const { cod, name_list, price, cant, descr, fech } = req.body;
  const Lista = require("../models/lista_invent");

  try {
    const existingProdut = await Lista.findOne({ cod });

    if (existingProdut) {
      req.flash(
        "errorMessage",
        "¡El código del producto ya se encuentra registrado!"
      );
      res.redirect("/newP");
    } else if (fech) {
      const newList = new Lista({
        cod,
        name_list,
        price,
        cant,
        descr,
        fech,
      });

      await newList.save();
      req.flash("successMessage", "¡Producto registrado!");
      res.redirect("/newP");
    } else {
      req.flash("errorMessage", "La fecha es un campo obligatorio");
      res.redirect("/newP");
    }
  } catch (error) {
    console.error(error);
    req.flash("errorMessage", "Error al registrar el producto");
    res.redirect("/newP");
  }
});

router.get("/newS/:cod", isAuthenticated, async (req, res, next) => {
  const Producto = require("../models/lista_invent");
  try {
    const cod = req.params.cod; // Obtener el código del producto a editar
    const producto = await Producto.findOne({ cod: cod });

    if (!producto) {
      // Manejar el caso en el que el producto no se encuentre
      res.render("error", { errorMessage: "Producto no encontrado." });
    } else {
      // Transforma la fecha en el formato deseado
      producto.fech = producto.fech.toDateString();

      res.render("newS", { producto: producto });
    }
  } catch (error) {
    console.error(error);
    res.render("error", {
      errorMessage: "Error al obtener el producto para editar.",
    });
  }
});

router.post("/newS/:cod", isAuthenticated, async (req, res, next) => {
  const Producto = require("../models/lista_invent");
  try {
    const cod = req.params.cod; // Obtener el código del producto a editar

    if (!req.body.fech || req.body.fech.trim() === "") {
      req.flash("errorMessage", "¡La fecha es un campo obligatorio!");
      res.redirect(`/newS/${cod}`);
    } else {
      // Actualizar los datos del producto
      await Producto.updateOne(
        { cod: cod },
        {
          $set: {
            name_list: req.body.name_list,
            price: req.body.price,
            cant: req.body.cant,
            descr: req.body.descr,
            fech: new Date(req.body.fech), // Asegura que la fecha sea un objeto Date
          },
        }
      );

      //req.flash('successMessage', '¡Producto editado con éxito!');
      res.redirect("/invent");
    }
  } catch (error) {
    console.error(error);
    req.flash("errorMessage", "Error al editar el producto.");
    res.redirect(`/newS/${cod}`);
  }
});

router.get("/deleteP:cod", isAuthenticated, async (req, res, next) => {
  const Producto = require("../models/lista_invent");

  try {
    const cod = req.params.cod;
    await Producto.deleteOne({ cod: cod });

    res.redirect("/invent");
  } catch (error) {
    console.error(error);
    res.redirect("/invent");
  }
});

router.get("/deleteCol:email", isAuthenticated, async ( req, res, next) =>{
  const Producto = require("../models/user");

  try {
    const email = req.params.email;
    await Producto.deleteOne({ email: email });
    res.redirect("/admin");

  } catch (error) {
    console.error(error);
    res.redirect("/admin");
  }

});

const Producto = require("../models/lista_invent");
const { json } = require("body-parser");
const prov = require("../models/prov");
router.get("/ventas", isAuthenticated, async (req, res, next) => {
  try {
    const productos = await Producto.find({});
    res.render("ventas", { productos, produc_ok: null, errorMessage: null });
  } catch (error) {
    console.error(error);
    res.render("ventas", {
      productos: [],
      produc_ok: null,
      errorMessage: "Error al obtener la lista de productos",
    });
  }
});

router.get("/ventas/buscar", isAuthenticated, async (req, res, next) => {
  const codigoProducto = req.query.codigo;
  res.setHeader("Content-Type", "application/json");
  let response;
  let resultadojson={
    continua:false
  }
  try {
    const productoEncontrado = await Producto.findOne({ cod: codigoProducto });

    if (productoEncontrado) {
      // Crea una plantilla HTML para mostrar los detalles del producto
      resultadojson = {
        continua:true,
        codigo: productoEncontrado.cod,
        nombre: productoEncontrado.name_list,
        precio: productoEncontrado.price,
        cantidad: productoEncontrado.cant,
        descrip: productoEncontrado.descr,
        _id: productoEncontrado._id,
      };

      response = resultadojson;
      
    } else {
      // Crea una plantilla HTML para indicar que el producto no se encontró
      const resultadojson = {
        ...resultadojson,
        mensaje:"Producto no encontrado"
      }
    }
  } catch (error) {
    // Crea una plantilla HTML para manejar errores
    const resultadojson = {
      mensaje:"Producto no encontrado"
    }  
    //res.send(resultadoHTML);
    
  }
  res.json(response);
});

router.post("/ventas", isAuthenticated, (req, res, next) => {
  const codigoProducto = req.body.carrito;
  res.setHeader("Content-Type", "application/json");
  let resultadojson={
    continua:true,
  }

  // si se guardo devolver c ontinua:true
  
  // si NO se guardo devolver c ontinua:false

  console.log("respuesta-ale",codigoProducto)

  // antes de responder evaluar resultadojson continua
  res.json(resultadojson);
});

router.get("/fact", isAuthenticated, (req, res, next) => {
  res.render("fact");
});

router.get("/report", isAuthenticated, async(req, res, next) => {
  res.render('report');
});

router.get("/admin", isAuthenticated, async(req, res, next) => {
  const ProductoClien = require("../models/clientes");
  const ProductoProv = require("../models/prov");
  const ProductoSucur = require("../models/Sucursal");
  const ProductUs = require("../models/user"); 

  try {
    const productosC = await ProductoClien.find({});
    const totalproductsC = productosC.length;

    const productosPrv = await ProductoProv.find({});
    const totalP = productosPrv.length;

    const productosSuc = await ProductoSucur.find({});
    const totalS = productosSuc.length;

    const ProductsClien = await ProductUs. find({});

    res.render("admin", {
      productosC: productosC,
      productosPrv: productosPrv,
      productosSuc: productosSuc,
      totalproductsC: totalproductsC, 
      totalS: totalS, 
      totalP: totalP, 
      ProductsClien
    });
  } catch (error) {
    console.error(error);
    res.render("error", {
      errorMessage: "Error al obtener la lista de productos.",
    });
  }
  //res.render('admin');
});

router.get("/clientes", isAuthenticated, (req, res, next) => {
  res.render('clientes', {
    successMessage: req.flash("successMessage"),
    errorMessage: req.flash("errorMessage")
  });
  
});

router.post("/clientes", isAuthenticated, async (req, res, next) =>{
  const {cedula, nombre, apellidos, telefono, correo, direccion, tipoCliente } = req.body;
  const Registro = require("../models/clientes");

  try {
    const existingProdut = await Registro.findOne({cedula});

    if(existingProdut) {
      req.flash(
        "errorMessage",
        "¡La cedula ya se encuentra registrada!"
      );
      res.render('/clientes');
    }else if(cedula){
      const newRegistro = new Registro({
        cedula,
        nombre,
        apellidos,
        telefono,
        correo,
        direccion,
        tipoCliente,
      });
      await newRegistro.save();
      req.flash("successMessage", "¡Cliente Registrado!");
      res.redirect("/clientes");
  }else{

 req.flash("errorMessage", "La cedula es un campo obligatorio");
      res.redirect("/clientes");
    }
  } catch (error) {
    console.error(error);
    req.flash("errorMessage", "Error al registrar el cliente");
    res.redirect("/clientes");
  }
});

router.get("/proveedores", isAuthenticated, (req, res, next) => {
  res.render('proveedores', {
    successMessage: req.flash("successMessage"),
    errorMessage: req.flash("errorMessage")
  });
});

router.post("/proveedores", isAuthenticated, async (req, res, next) => {
  const {proveedor, nit, direccion, contacto, telefono, correo, tipoProveedor } = req.body;
  const RegistroP = require("../models/prov");
  
  try{
    const existingProv = await RegistroP.findOne({nit});

    if(existingProv) {
      req.flash(
        "errorMessage",
        "¡El Nit ya se encuentra registrada!"
      );
      res.render('/proveedores');
    }else if(nit){
      const newRegistroP = new RegistroP({
        proveedor,
        nit,
        direccion,
        contacto,
        telefono,
        correo,
        tipoProveedor,
      });
      await newRegistroP.save();
      req.flash("successMessage", "¡Proveedor Registrado!");
      res.redirect("/proveedores");
  }else{

 req.flash("errorMessage", "El nit es un campo obligatorio");
      res.redirect("/proveedores");
    }
  } catch (error) {
    console.error(error);
    req.flash("errorMessage", "Error al registrar Proveedor");
    res.redirect("/proveedores");
  }
});

router.get("/sucursal", isAuthenticated, (req, res, next) => {
    res.render('sucursal', {
      successMessage: req.flash("successMessage"),
      errorMessage: req.flash("errorMessage")
    });
});

router.post("/sucursal", isAuthenticated, async (req, res, next) => {
    const {nombre, direccion, telefono, correo, estado , tipoSucursal } = req.body;
    const RegistroS = require("../models/Sucursal");
  
    try {
      const existingSucursal = await RegistroS.findOne({nombre});
  
      if(existingSucursal) {
        req.flash(
          "errorMessage",
          "¡El nombre ya se encuentra registrado!"
        );
        res.render('/sucursal');
      }else if(nombre){
        const newRegistroS = new RegistroS({
          nombre,
          direccion,
          telefono,
          correo,
          estado,
          tipoSucursal,
        });
        await newRegistroS.save();
        req.flash("successMessage", "¡Sucursal Registrada!");
        res.redirect("/sucursal");
    }else{
  
   req.flash("errorMessage", "El campo nombre es un campo obligatorio");
        res.redirect("/sucursal");
      }
    } catch (error) {
      console.error(error);
      req.flash("errorMessage", "Error al registrar Sucursal");
      res.redirect("/sucursal");
    }
});
  
 
router.post("/");

function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  res.redirect("/index");
}

module.exports = router;


