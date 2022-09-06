exports.userRoles = [{
    name: 'Owner',
    canAccessOwner: true,
    canAccessAdmin: true,
    canAccessTeacher: true,
    canAccessStudent: true
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
//'Admin','Teacher','Student','Janitor'