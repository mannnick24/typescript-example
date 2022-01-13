describe('Promise tests', () => {
  function doSomethingAsync(): Promise<string> {
    return Promise.resolve('hello');
  }

  function sleep(time: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, time));
  }

  function sleepExpanded(time: number): Promise<void> {
    console.log(1);
    return new Promise((resolve) => {
      console.log(2);
      return setTimeout(() => {
        console.log(3);
        resolve();
      }, time);
    });
  }

  test('nested promise chain', () => {
    return new Promise<void>((resolve) => {
      return sleepExpanded(10).then(() => {
        console.log(4);
        return doSomethingAsync().then((msg: string) => {
          console.log(msg);
          return resolve();
        });
      });
    });
  });

  test('nested promise chain with state', () => {
    let temp = '1';
    return new Promise<string>((resolve) => {
      return sleepExpanded(10).then(() => {
        temp += '2';
        return doSomethingAsync().then((msg: string) => {
          temp += '3';
          return resolve(temp);
        });
      });
    });
  });

  test('promise chain better', () => {
    return new Promise<void>((resolve) => {
      return sleepExpanded(10)
        .then(() => {
          console.log(4);
          return doSomethingAsync();
        })
        .then((msg: string) => {
          console.log(msg);
          return resolve();
        });
    });
  });

  test('promise chain even better', () => {
    return sleepExpanded(10)
      .then(() => {
        console.log(4);
        return doSomethingAsync();
      })
      .then((msg: string) => {
        console.log(msg);
      });
  });

  test('promise chain with error', () => {
    return sleepExpanded(10)
      .then(() => {
        console.log(4);
        return doSomethingAsync();
      })
      .then((msg: string) => {
        throw new Error(msg);
      })
      .then((msg: string) => {
        console.log('never gets here');
      })
      .catch((err) => {
        console.log(err);
      });
  });

  // spot the problem!
  test('broken promise chain', () => {
    return sleepExpanded(10)
      .then(() => {
        doSomethingAsync();
      })
      .then(() => {
        console.log('gets here too early');
      });
  });

  test('async await even better', async () => {
    await sleepExpanded(10);
    console.log(4);
    const msg = await doSomethingAsync();
    console.log(msg);
  });

  test('async await error', async () => {
    try {
      await sleepExpanded(10);
      console.log(4);
      const msg = await doSomethingAsync();
      throw new Error(msg);
      // console.log("never gets here");
    } catch (ex) {
      console.log(ex);
    }
  });
});
