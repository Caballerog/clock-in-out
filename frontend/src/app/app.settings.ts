import { environment } from 'src/environments/environment';

export class AppSettings {
  static readonly TYPE_ACTION = {
    INPUT: 'input',
    OUTPUT: 'output',
  };
  static readonly DATE_FORMAT = 'DD/MM/YYYY HH:mm:ss';
  static readonly APIENDPOINT = environment.APIENDPOINT_BACKEND;
  static readonly APIENDPOINT_USER = `${AppSettings.APIENDPOINT}/user`;
  static readonly APIENDPOINT_USERS = `${AppSettings.APIENDPOINT}/users`;
}
