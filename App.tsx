import {Button, SafeAreaView, StyleSheet, Text, TextInput} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';

import {openDatabase} from 'react-native-sqlite-storage';

const db = openDatabase({
  name: 'my_sqlite.db',
});

const App = () => {
  const inputRef = useRef(null);

  const [name, setName] = useState('');
  const [data, setData] = useState([]);

  useEffect(() => {
    createTable();
  }, []);

  const createTable = () => {
    db.transaction(tx => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS data (id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(20))`,
        [],
        (tx: any, results: any) => {
          console.log('tx', tx);
          console.log('results', results);

          tx.executeSql('SELECT * FROM data', [], (tx: any, results: any) => {
            var len = results.rows.length;
            for (let i = 0; i < len; i++) {
              let row = results.rows.item(i);
              console.log(`Name: ${row.name}`);
              setData((prevData: any) => {
                return [...prevData, row.name];
              });
            }
          });
        },
        (error: any) => {
          console.log('error', error);
        },
      );
    });
  };

  const onPressAdd = () => {
    db.transaction(tx => {
      tx.executeSql(
        `INSERT INTO data (name) VALUES (?)`,
        [name],
        (tx: any, results: any) => {
          console.log('tx', tx);
          console.log('results', results);
          setData((prevData: any) => {
            return [...prevData, name];
          });
          setName('');
        },
        (error: any) => {
          console.log('error', error);
        },
      );
    });
  };

  return (
    <SafeAreaView>
      <TextInput
        style={{height: 40, margin: 12, borderWidth: 1, padding: 10}}
        onChangeText={setName}
        value={name}
      />
      <Button onPress={onPressAdd} title="Add Name" color="#841584" />
      {data.map((ele, index) => {
        return <Text key={index}>{ele}</Text>;
      })}
    </SafeAreaView>
  );
};

export default App;

const styles = StyleSheet.create({});
