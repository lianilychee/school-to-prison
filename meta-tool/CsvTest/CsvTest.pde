Table table;
void setup() {
  
  table = loadTable("Are_We_Closing_Elementary.csv", "header");

  println(table.getRowCount() + " total rows in table"); 

  for (TableRow row : table.rows()) {
    println(row.getString("District Name"));
    println(row);
  }
  
}