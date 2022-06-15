//em todo middleware necessita de nexta para a requisão terminar

exports.middlewareGlobal = (req, res, next) => {
    res.locals.errors = req.flash('errors');//uma forma de injetar conteudo no ejs sem ser por obj como no homeControllers. e essa fica disponivel para qualquer pagina, pois não tem rota na pag. server.js em ->> app.use(middlewareGlobal)
    res.locals.success = req.flash('success');
    res.locals.user = req.session.user;
    next();
  };
  
  exports.outroMiddleware = (req, res, next) => {
    next();
  };
  
  exports.checkCsrfError = (err, req, res, next) => {
    if(err) {
      return res.render('404');
    }
  
    next();
  };//uma função para checar os possiveis erros de csrf. se tiver qualqer um, mostre 404
  
  exports.csrfMiddleware = (req, res, next) => {
    res.locals.csrfToken = req.csrfToken();
    next();
  };
  
  exports.loginRequired = (req, res, next) => {
    if(!req.session.user) {
      req.flash('errors', 'Você precisa fazer login.');
      req.session.save(() => res.redirect('/'));
      return;
    }
  
    next();
  };