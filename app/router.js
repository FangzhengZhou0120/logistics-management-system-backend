/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.post('/api/waybill/list', controller.waybill.list);
  router.post('/api/waybill/create', controller.waybill.create);
  router.post('/api/waybill/cancel', controller.waybill.cancelWaybill);
  router.get('/api/waybill/detail', controller.waybill.find);
  router.post('/api/waybill/finish', controller.waybill.finsihWaybill);
  router.get('/api/waybill/upload', controller.waybill.getUploadConfig);

  router.post('/api/user/list', controller.user.list);
  router.post('/api/user/create', controller.user.create);
  router.get('/api/user/role', controller.user.getUserByRole);
  router.post('/api/user/update', controller.user.update);
  router.post('/api/user/delete', controller.user.delete);
  router.post('/api/login', controller.user.login)
  router.get('/api/logout', controller.user.logout)

  // router.get('/city/import', controller.city.importCity);
  // router.get('/city/list', controller.city.getCityList);

  router.post('/api/position/now', controller.position.getVehiclePosition);
  router.post('/api/position/trajectory', controller.position.getTrajectory);
};
