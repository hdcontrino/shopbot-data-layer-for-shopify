import db from "../db.server";

export async function getGTM() {
  return await db.gTM.findFirst({ where: { id: 1} });
}

export async function setGTM(value) {
  return await db.gTM.update({ where: {id: 1}, data: { tag: value } });
}
