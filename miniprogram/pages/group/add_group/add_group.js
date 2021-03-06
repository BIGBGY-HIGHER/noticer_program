// miniprogram/pages/group/add_group/add_group.js
const app = getApp();

Page({
  data: {
    groups: []
  },

  groupChange: function(e) {
    var groupIndex = e.detail.value
    //console.log(classIndex)
    this.setData({
      groupIndex: groupIndex,
      groupID: this.data.groups[groupIndex]['_id']
    })
  },

  confirm: function(e) {
    const db = wx.cloud.database()
    const _ = db.command
    db.collection('Groups').doc(this.data.groupID).get().then(res => {
      console.log(res.data)
      if (res.data.admins.indexOf(app.globalData.userdata['name']) == -1) {//不在admins中
        db.collection('Groups').doc(this.data.groupID).update({
          data: {
            admins: _.push(app.globalData.userdata['name'])
          }, success: res => {
            wx.showToast({
              title: '加入成功',
              duration: 2000,
              success: function () {
                var util = require("../../../utils/util.js")
                util.getGroups()
                setTimeout(function () {
                  wx.navigateBack()
                }, 2000);
              }
            });
          }
        })
      }
    })
  },

  onLoad: function(options) {
    this.setData({
      groups: app.globalData.allGroups
    })
    console.log(this.data.groups)
  },
})
