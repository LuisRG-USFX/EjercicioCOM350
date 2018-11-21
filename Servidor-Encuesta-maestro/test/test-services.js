const chai  = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();

chai.use(chaiHttp);

describe('/POST authorize admin', function(){
    it('it should authorize admin login', function(done) {
        const credentials = {
            userName: "admin",
            password: "password"
        }
        chai.request('http://localhost:5555')
            .post('/authorizeLogin')
            .send(credentials)
            .end(function (err, res) {
                if(err)
                    console.error(err);
                should.exist(res);
                res.should.have.status(200);
                done();
            });
    });
});

describe('/POST survey data', function(){
    it('it should post survey data to database', function(done) {
        const data= {
            firstName: "John",
            lastName: "Appleseed",
            age:    45,
            region: 'North America',
            artist: 'Eminem'
        }
        chai.request('http://localhost:5555')
            .post('/sendSurveyData')
            .send(data)
            .end(function (err, res) {
                if(err)
                    console.error(err);
                should.exist(res);
                res.should.have.status(200);
                done();
            });
    });
});