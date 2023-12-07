const models = require('../models');
const {Op} = require('sequelize');

async function publish_assignment() {
  try{
    console.log("[toddle][server][utilities][periodic_operations][publish_assignment][start]");
    const assignment_to_be_published = await models.assignments.findAll({
        attributes: ['assignment_id'],
        where: {
            is_active: 1,
            published_at: { [Op.lte] : new Date()},
            assignment_status: app_constants.assignment_status.scheduled
        },
        raw: true
    });

    const assignment_ids = assignment_to_be_published.map((x) => {
      return x.assignment_id;
    });
    
    if(assignment_ids && assignment_ids.length){
        await models.assignments.update(
          {
            assignment_status: app_constants.assignment_status.ongoing,
          },
          {
            where: {
              assignment_id: assignment_ids,
            },
          }
        );
    }

  }catch(err){
    console.log("[toddle][server][utilities][periodic_operations][publish_assignment][error]"+JSON.stringify(err));
  }
}

async function close_assignment() {
    try{
      console.log("[toddle][server][utilities][periodic_operations][close_assignment][start]");
      const assignment_to_be_closed = await models.assignments.findAll({
          attributes: ['assignment_id'],
          where: {
              is_active: 1,
              deadline: { [Op.gte] : new Date()},
              assignment_status: app_constants.assignment_status.ongoing
          },
          raw: true
      });

      const assignment_ids = assignment_to_be_closed.map((x) => {
        return x.assignment_id;
      });
      
      if(assignment_ids && assignment_ids.length){
          await models.assignments.update(
            {
              assignment_status: app_constants.assignment_status.closed,
            },
            {
              where: {
                assignment_id: assignment_ids,
                is_active: 1,
              },
            }
          );

          await models.assignment_map_students.update({
            status: app_constants.assignment_status.overdue,
          }, {
            where: {
              assignment_id: assignment_ids,
              is_active: 1,
              status: { [Op.ne]: app_constants.assignment_status.submitted },
            }
          })
      }
  
    }catch(err){
      console.log("[toddle][server][utilities][periodic_operations][close_assignment][error]"+JSON.stringify(err));
    }
  }

setInterval(async () => {
  await publish_assignment();
  await close_assignment();
}, 3600000);

module.exports = { publish_assignment, close_assignment };
