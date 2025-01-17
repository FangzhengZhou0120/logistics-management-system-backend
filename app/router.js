/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.post('/waybill/list', controller.waybill.list);
  router.post('/waybill/create', controller.waybill.create);
  router.post('/waybill/cancel', controller.waybill.cancelWaybill);
  router.get('/waybill/detail', controller.waybill.find);
  router.post('/waybill/finish', controller.waybill.finsihWaybill);
  router.get('/waybill/upload', controller.waybill.getUploadConfig);

  router.post('/user/list', controller.user.list);
  router.post('/user/create', controller.user.create);
  router.get('/user/role', controller.user.getUserByRole);
  router.post('/user/update', controller.user.update);
  router.post('/user/delete', controller.user.delete);
  router.post('/login', controller.user.login)
  router.get('/logout', controller.user.logout)

  // router.get('/city/import', controller.city.importCity);
  // router.get('/city/list', controller.city.getCityList);

  router.post('/position/now', controller.position.getVehiclePosition);
  router.post('/position/trajectory', controller.position.getTrajectory);
};
