import Model from "./model"


class ArgumentListModel extends Model {

  insert = async (data) => {
    await this._connect()
    const query = "INSERT INTO `argument_lists` (`list`) VALUES (?)"
    const result = await this._execute(query, [data.list])
    await this._disconnect()
    return result[0]
  }

  select = async (id) => {
    await this._connect()
    const query = "SELECT * FROM `argument_lists` WHERE `argument_list_id` = ?"
    const rows = (await this._execute(query, [id]))[0]
    await this._disconnect()
    return rows[0]
  }

  delete = async (id) => {
    await this._connect()
    const query = "DELETE FROM `argument_lists` WHERE `argument_list_id` = ?"
    const result = await this._execute(query, [id])
    await this._disconnect()
    return result[0]
  }

}

export default ArgumentListModel