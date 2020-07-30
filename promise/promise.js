(function (window) {

  const PENDING = 'pending'
  const ONRESOVLED = 'onResolved'
  const ONREJECTED = 'onRejected'

  /**
   * 构造函数里做的事情：
   * 1、执行外部的excutor
   * 2、声明resolve和reject函数
   * 3、声明默认的status、data、和回调函数数组callbacks
   * 4、理解promise的关键在于异步任务会在同步任务执行完后再去执行
   * 也就是 通过将回调函数放在异步任务中，可以确保回调函数能够拿到resolve或者reject的数据
   * 那么就可以在想要的数据的时候执行回调即可，而不必每次在执行任务的时候都得先声明回调函数
   * @param {*} excutor 
   */
  function Promise (excutor) {
    // 将当前prosmise对象保存起来
    const self = this
    self.status = PENDING
    self.data = undefined
    self.callbacks = []  // callbacks是{onResolved: function, onRejected: function}

    // 改变状态的回调函数
    function resolve (value) {
      if (self.status !== PENDING) {
        return
      }
      self.status = ONRESOVLED
      self.data = value
      // 如果有回调函数，也就是说在new Promise后，有调用.then方法，那么就要异步执行回调函数
      // 异步执行，也就是在同步操作完成后在执行的操作，通过web APIs放到回调队列中
      if (self.callbacks.length > 0) {
        setTimeout(() => {
          self.callbacks.forEach(callbackObj => {
            callbackObj.onResolved(value) // 这里的精髓在于 这里的value是excutor里的执行结果，然后传到了回调函数里，从而回调函数能够拿到数据
          })
        })
        // self.callbacks.forEach(callbackObj => {
        //   callbackObj.onResolved(value)
        // })
      }
    }

    function reject (reason) {
      if (self.status !== PENDING) {
        return
      }
      self.status = ONREJECTED
      self.data = reason
      if (self.callbacks.length > 0) {
        setTimeout(() => {
          self.callbacks.forEach(callbackObj => {
            callbackObj.onRejected(reason)
          })
        })
      }
    }
    try {
      excutor(resolve, reject) // 外部传入excutor，其执行环境在全局环境，调用的resolve和reject方法中的self指向window
    } catch (e) {
      console.log(e, 111)
      reject(e)
    }
  }
  window.Promise = Promise


  /**
   * 原型上的方法
   * 主要的三件事
   * 1、返回一个新的promise对象
   * 2、执行回调函数
   * 3、执行的回调函数的结果会影响返回的promise的状态
   * @param {*} onResolved 
   * @param {*} onRejected 
   */
  Promise.prototype.then = function (onResolved, onRejected) {
    const self = this

    onResolved = typeof onResolved === 'function' ? onResolved : value => value
    onRejected = typeof onRejected === 'function' ? onRejected : reason => { throw reason }

    return new Promise((resolve, reject) => {

      function handle (callback) {
        try {
          const result = callback(self.data)
          if (result instanceof Promise) {
            result.then(resolve, reject)
          } else {
            resolve(result)
          }
        } catch (error) {
          reject(error)
        }
      }

      /**
       * 什么时候处于onResolved状态呢？
       * 也就是当excutor里的任务执行完后，调用resolve()方法，而此时回调函数数组里没有回调函数
       * 那么我们直接执行回调函数 onResolved(self.data)
       */
      if (self.status === ONRESOVLED) {
        /**
         * 1、一般情况下，我们直接执行 onResolved(self.data)即可，也就是没有返回值，但是如果 onResolved(self.data)有返回值
         * 那么我们需要根据返回值，来进一步做处理
         * 2、如果 onResolved(self.data)的返回值是一个value，那么我们直接resolve即可
         * 3、如果返回的值是一个Promise对象，那么我们就需要通过 .then方法来改变返回的promise的状态和data
         * 4、当抛出异常后，我们直接捕获异常 reject掉即可
         */
        handle(onResolved)
      } else if (self.status === ONREJECTED) {
        handle(onRejected)
      } else {
        /**
         * 异步执行回调函数
         * 也就是当.then里没有调用resolve或者reject的时候
         * 将 onResolved 和 onRejected 放在函数里能够使得之后的回调函数能够改变promise的状态，否则直接传回调进去无法改变promise的状态
         */
        // setTimeout(() => {
        //   self.callbacks.push({
        //     onResolved,
        //     onRejected
        //   })
        // })
        self.callbacks.push({
          onResolved () {
            handle(onResolved)
          },
          onRejected () {
            handle(onRejected)
          }
        })
      }
    })
  }

  Promise.prototype.catch = function (onRejected) {
    return this.then(undefined, onRejected)
  }

  /**
   * 函数对象上的方法, 返回一个promise对象
   * 传一个value进来，可能是值，可能是promise对象，那么就和.then方法里的resolved基本一样
   * @param {*} value 
   */
  Promise.resolve = function (value) {
    return new Promise((resolve, reject) => {
      if (value instanceof Promise) {
        value.then(resolve, reject)
      } else {
        resolve(value)
      }
    })
  }

  Promise.reject = function (reason) {
    return new Promise((resolve, reject) => {
      reject(reason)
    })
  }

  Promise.all = function (promises) {

  }

  Promise.race = function (promises) {

  }

})(window)