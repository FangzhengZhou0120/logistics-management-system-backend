const Controller = require('egg').Controller;

class CityController extends Controller {
    async importCity() {
        const city = await this.ctx.service.city.importCity();
        this.ctx.body = city;
    }

    async getCityList() {
        const city = await this.ctx.service.city.getCityList();
        this.ctx.body = city;
    }
}

module.exports = CityController;