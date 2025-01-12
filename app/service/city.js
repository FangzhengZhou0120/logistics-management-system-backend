const Service = require('egg').Service;
const axios = require('axios');

class City extends Service {

    // async importCity() {
    //     const { ctx } = this;
    //     const result = await axios.get('https://restapi.amap.com/v3/config/district?key=1e16e76a20925cfe0f6be41299472a33&keywords=&subdistrict=2&extensions=base');
    //     const data = result.data.districts[0].districts;
    //     const cityList = [];
    //     //console.log(data)
    //     data.forEach(province => {
    //         province.districts.forEach(city => {
    //             cityList.push({
    //                 cityName: city.name,
    //                 cityCode: city.adcode,
    //                 parentName: province.name,
    //                 parentCode: province.adcode
    //             })
    //         })
    //     })
    //     const city = await ctx.model.City.bulkCreate(cityList);
    //     return city;
    // }

    async getCityList() {
        const { ctx } = this;
        const city = await ctx.model.City.findAll();
        return city;
    }
}

module.exports = City