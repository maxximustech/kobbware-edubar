exports.userRoles = [{
    name: 'Owner',
    canAccessOwner: true,
    canAccessAdmin: true,
    canAccessTeacher: true,
    canAccessStudent: false
},{
    name: 'Admin',
    canAccessOwner: false,
    canAccessAdmin: false,
    canAccessTeacher: true,
    canAccessStudent: true,
},{
    name: 'Teacher',
    canAccessOwner: false,
    canAccessAdmin: false,
    canAccessTeacher: false,
    canAccessStudent: true
},{
    name: 'Student',
    canAccessOwner: false,
    canAccessAdmin: false,
    canAccessTeacher: false,
    canAccessStudent: true
},
    ];
exports.jwtSecret = '449a9ddb3d616c12c270ae9927544b6034bea8876f59f720a58ba844e93d41535499ed8c404831df14a0cf608f7e7e6263bef0587d72380df7791cfca455ad81';