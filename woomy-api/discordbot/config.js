const isDevApi = process.env.PROJECT_NAME==="woomy-api-dev"
export const config = {
  isDevApi: isDevApi,
  mainPrefix: isDevApi?"$":"!",
  botColor: "#8ABB44",
  
  ingameServersCategory: isDevApi?"1132953808520093777":"1142503228790026410",
  testingChannel: "1112165525640990730",
  chatlogChannel: "1128737082894975078",
  recordChannel: "1126041732350480414",
  
  roles: {
    newsletter: "1133822540771500085",
    betatester: "1121184780734709800",
    wrm: "1120104568647340113",
    overseerTrainee: "1127114534390337616",
    overseer: "1107614332902195211",
    supervisor: "1107338874319032461",
    supervisorTrainee: "1127114522293960805",
    admin: "1107339006263443486",
    developer: "1107338939355889684",
  }
}