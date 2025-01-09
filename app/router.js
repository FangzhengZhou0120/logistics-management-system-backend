/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.post('/waybill/list', controller.waybill.list);
  router.post('/waybill/create', controller.waybill.create);
  router.post('/waybill/cancel', controller.waybill.delete);

  router.post('/user/list', controller.user.list);
  router.post('/user/create', controller.user.create);
};
