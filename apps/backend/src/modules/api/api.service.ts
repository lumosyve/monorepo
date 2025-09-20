import { Injectable } from '@nestjs/common';

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

@Injectable()
export class ApiService {
  private users: User[] = [
    { id: 1, name: '张三', email: 'zhangsan@example.com', role: 'admin' },
    { id: 2, name: '李四', email: 'lisi@example.com', role: 'user' },
    { id: 3, name: '王五', email: 'wangwu@example.com', role: 'user' },
  ];

  getUsers(): User[] {
    return this.users;
  }

  getUserById(id: number): User | undefined {
    return this.users.find(user => user.id === id);
  }

  createUser(userData: Omit<User, 'id'>): User {
    const newUser = {
      id: this.users.length + 1,
      ...userData,
    };
    this.users.push(newUser);
    return newUser;
  }

  getData(type: string): any {
    switch (type) {
      case 'stats':
        return {
          totalUsers: this.users.length,
          activeUsers: this.users.length - 1,
          adminCount: this.users.filter(u => u.role === 'admin').length,
        };
      case 'config':
        return {
          apiVersion: '1.0.0',
          features: {
            userManagement: true,
            reporting: false,
            analytics: true,
          },
        };
      default:
        return {
          message: '请指定有效的数据类型',
        };
    }
  }
}