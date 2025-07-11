import mongoose from 'mongoose';
import { expect } from 'chai';

describe('MongoDB Connection', function () {
  this.timeout(10000); // Por si la conexión tarda

  it('debería conectarse correctamente a la base de datos', async () => {
    
    const mongoUrl = process.env.MONGO_URL;
    let error = null;
    try {
      await mongoose.connect(mongoUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
    } catch (err) {
      error = err;
    }
    expect(error).to.be.null;
    expect(mongoose.connection.readyState).to.equal(1); // 1 = conectad
    
  });
});