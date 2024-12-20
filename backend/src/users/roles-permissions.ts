export const RolePermissions = {
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
  