"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RolePermissions = void 0;
exports.RolePermissions = {
    student: [
        'view-dashboard',
        'view-courses',
        'access-forum',
        'submit-assignments',
        'update-profile',
    ],
    instructor: [
        'create-courses',
        'edit-courses',
        'view-students',
        'access-analytics',
        'moderate-forum',
    ],
    admin: ['manage-users', 'view-logs', 'backup-system', 'manage-courses'],
};
//# sourceMappingURL=roles-permissions.js.map