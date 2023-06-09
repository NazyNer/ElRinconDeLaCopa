//  public async Task<IActionResult> Index()
//         {
//             return View(await _context.Productos.ToListAsync());
//         }
//         public IActionResult Catalogo()
//         {
//             return View();
//         }

//         // GET: Producto/Details/5
//         public async Task<IActionResult> Details(int? id)
//         {
//             if (id == null)
//             {
//                 return NotFound();
//             }

//             var producto = await _context.Productos
//                 .FirstOrDefaultAsync(m => m.ID == id);
//             if (producto == null)
//             {
//                 return NotFound();
//             }

//             return View(producto);
//         }

//         // GET: Producto/Create
//         public IActionResult Create()
//         {
//             return View();
//         }

//         // POST: Producto/Create
//         // To protect from overposting attacks, enable the specific properties you want to bind to.
//         // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
//         [HttpPost]
//         [ValidateAntiForgeryToken]
//         public async Task<IActionResult> Create([Bind("ID,IDCategoria,Nombre,Precio,Cantidad,Imagen,NombreImagen,TipoImagen")] Producto producto)
//         {
//             if (ModelState.IsValid)
//             {
//                 _context.Add(producto);
//                 await _context.SaveChangesAsync();
//                 return RedirectToAction(nameof(Index));
//             }
//             return View(producto);
//         }

//         // GET: Producto/Edit/5
//         public async Task<IActionResult> Edit(int? id)
//         {
//             if (id == null)
//             {
//                 return NotFound();
//             }

//             var producto = await _context.Productos.FindAsync(id);
//             if (producto == null)
//             {
//                 return NotFound();
//             }
//             return View(producto);
//         }

//         // POST: Producto/Edit/5
//         // To protect from overposting attacks, enable the specific properties you want to bind to.
//         // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
//         [HttpPost]
//         [ValidateAntiForgeryToken]
//         public async Task<IActionResult> Edit(int id, [Bind("ID,IDCategoria,Nombre,Precio,Cantidad,Imagen,NombreImagen,TipoImagen")] Producto producto)
//         {
//             if (id != producto.ID)
//             {
//                 return NotFound();
//             }

//             if (ModelState.IsValid)
//             {
//                 try
//                 {
//                     _context.Update(producto);
//                     await _context.SaveChangesAsync();
//                 }
//                 catch (DbUpdateConcurrencyException)
//                 {
//                     if (!ProductoExists(producto.ID))
//                     {
//                         return NotFound();
//                     }
//                     else
//                     {
//                         throw;
//                     }
//                 }
//                 return RedirectToAction(nameof(Index));
//             }
//             return View(producto);
//         }

//         // GET: Producto/Delete/5
//         public async Task<IActionResult> Delete(int? id)
//         {
//             if (id == null)
//             {
//                 return NotFound();
//             }

//             var producto = await _context.Productos
//                 .FirstOrDefaultAsync(m => m.ID == id);
//             if (producto == null)
//             {
//                 return NotFound();
//             }

//             return View(producto);
//         }

//         // POST: Producto/Delete/5
//         [HttpPost, ActionName("Delete")]
//         [ValidateAntiForgeryToken]
//         public async Task<IActionResult> DeleteConfirmed(int id)
//         {
//             var producto = await _context.Productos.FindAsync(id);
//             _context.Productos.Remove(producto);
//             await _context.SaveChangesAsync();
//             return RedirectToAction(nameof(Index));
//         }

//         private bool ProductoExists(int id)
//         {
//             return _context.Productos.Any(e => e.ID == id);
//         }
//     }