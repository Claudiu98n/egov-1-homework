'use strict';
const jwt_decode = require("jwt-decode");
const fs = require('fs');
const mime = require('mime-types');
const Serializer = require("damn-simple-xml");
const uuid = require('uuid');
const serializer = new Serializer();

module.exports = {

    async identifyUser(ctx) {
        let jwt = ctx.header.authorization.split("Bearer ")[1];
        let {id} = jwt_decode(jwt);

        const user = await strapi
            .query('user', 'users-permissions')
            .findOne({ id: id });

        return user;
    },

    async uploadFiles(ctx) {
        let data = {
            ...ctx.request.body.addressState, 
            ...ctx.request.body.paymentState, 
            totalPrice: ctx.request.body.totalPrice
        };

        const xmlName = uuid.v1();

        let xml = "";
            serializer.serialize({
            name: "data", 
            data: data
            }, function(err, xmlpart, level) {
            if (err) {
                console.log(err);
                return;
            }
            xml += xmlpart;
            if (level === 0) {
                fs.writeFile(`./public/uploads/${xmlName}.xml`, xml, uploadXML);
            }
        });

        const uploadXML = async () => {
            try {
                const rootDir = process.cwd();
                const fileName = `${xmlName}.xml`;
                const filePath = `${rootDir}/public/uploads/${fileName}`
                const stats = fs.statSync(filePath);
    
                await strapi.plugins.upload.services.upload.upload({
                    data: {}, 
                    files: {
                        path: filePath, 
                        name: fileName,
                        type: mime.lookup(filePath),
                        size: stats.size,
                    },
                });
            } catch (e) {
                console.log(e);
            }
        }

        return true;

    },

    async confirmPayment(ctx) {
        const {addressState, paymentState, totalPrice} = ctx.request.body;
        const user = this.identifyUser(ctx);

        try {
            await this.uploadFiles(ctx);

            await strapi.services['tickets'].create({
                ...addressState,
                totalPrice,
                user: user.id
            });
    
            await strapi.services['payments'].create({
                cardHolder: paymentState.cardHolder,
                cardNumber: Number(paymentState.cardNumber),
                expDate: paymentState.expDate,
                cardType: paymentState.cardType,
                user: user.id
            });

        } catch(e) {
            console.log(e.message);
        }

        return true;
    },

};
