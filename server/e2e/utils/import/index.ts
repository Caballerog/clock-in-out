const xls = require('node-xlsx')
  .parse(__dirname + '/schedule.xls')[0]
  .data.slice(2);

export function XSLToJson() {
  return xls.reduce(convertToJson, [[], []]);
}
function convertToJson([schedulers, users], teacher) {
  const name = normalizeUID(teacher);
  const user = {
    uid: name,
    name,
  };
  const days = getDaysByTeacher(teacher);
  const scheduler = days.reduce(generateSchedulers.bind(null, name), []);
  return [[...schedulers, scheduler], [...users, user]];
}
function normalizeUID(teacher): string {
  let name = teacher[0].split(',');
  if (name.length > 1) {
    name = name[0] + ', ' + name[1].trim()[0] + '.';
  }
  return name;
}
function getDaysByTeacher(teacher): [any[], any[], any[], any[], any[]] {
  return [
    [...teacher.slice(1, 7), ...teacher.slice(8, 14)],
    [...teacher.slice(14, 20), ...teacher.slice(21, 27)],
    [...teacher.slice(27, 33), ...teacher.slice(34, 40)],
    [...teacher.slice(40, 46), ...teacher.slice(47, 53)],
    [...teacher.slice(53, 59), ...teacher.slice(60, 66)],
  ];
}
function factorySchedule({ name, room, hour, numberOfDay }) {
  return {
    user: {
      uid: name,
    },
    room: room.replace(/\n/g, ' - '),
    day: numberOfDay,
    hour,
  };
}

function generateSchedulers(name, schedulers, day, numberOfDay) {
  return [
    ...schedulers,
    day.reduce(generateScheduler.bind(null, numberOfDay, name), []),
  ];
}

function generateScheduler(numberOfDay, name, schedulers, room, hour) {
  return room
    ? [...schedulers, factorySchedule({ name, room, hour, numberOfDay })]
    : schedulers;
}

/*
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
 */
