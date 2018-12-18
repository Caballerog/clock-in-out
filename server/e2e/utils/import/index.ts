const xls = require('node-xlsx').parse(__dirname + '/schedule.xls');

export function XSLToJson() {
  const schedulers = [];
  const users = [];

  xls[0].data.slice(2).forEach(teacher => {
    let schedule = {};
    let user = {};

    let name = teacher[0].split(',');
    if (name.length > 1) {
      name = name[0] + ', ' + name[1].trim()[0] + '.';
    }
    user = {
      uid: name,
      name,
    };
    users.push(user);
    const monday = [...teacher.slice(1, 7), ...teacher.slice(8, 14)];
    const tuesday = [...teacher.slice(14, 20), ...teacher.slice(21, 27)];
    const wednesday = [...teacher.slice(27, 33), ...teacher.slice(34, 40)];
    const thursday = [...teacher.slice(40, 46), ...teacher.slice(47, 53)];
    const friday = [...teacher.slice(53, 59), ...teacher.slice(60, 66)];

    [monday, tuesday, wednesday, thursday, friday].forEach((day, numberOfDay) =>
      day.forEach((room, hour) => {
        if (room) {
          schedule = {
            user: {
              uid: name,
            },
            room: room.replace(/\n/g, ' - '),
            day: numberOfDay,
            hour,
          };
          schedulers.push(schedule);
        }
      }),
    );
  });
  return [schedulers, users];
}
