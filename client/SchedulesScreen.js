import React from 'react';
import { View, StyleSheet, ScrollView, Text } from 'react-native';
import { WebView } from 'react-native-webview';

const SchedulesScreen = () => {

  // Will change this to view from pdf instead of web url later
  const pdfUrls = [
    'https://drive.google.com/file/d/1bbwhQGtTKWpiwrwS-m20TW9Vza1KvxQZ/view',
        'https://drive.google.com/file/d/1It8iekXkn80VtXIRfZDk0o9oAPvlfvQ3/view',
        'https://drive.google.com/file/d/1qf0nER9kTk-yuN8I1TiuPp5GPmOqvoxZ/view',
        'https://drive.google.com/file/d/12Ss_1F1ZDirSxJ7UPJzT5LKTuqIwnxWF/view',
        'https://drive.google.com/file/d/12Xsc1PFDDu8cQGwsK2YbFzrQhVtZx-Tx/view',
        'https://drive.google.com/file/d/1sQtjY4R8rcW3MLHuljawoRXukCxLpYrD/view',
        'https://drive.google.com/file/d/16gcPyYAQAiP0MHZMVnrNXTBbCBk52qtx/view',
        'https://drive.google.com/file/d/1WOKVKPwUybKPdr098Dz27ja6hNVYurz4/view',
        'https://drive.google.com/file/d/1RFPcQGc8gqKXRm6L489Fu-MqGI4QFe_c/view',
        'https://drive.google.com/file/d/19MmpvX01GoxcO6e_TTOlguo-4r9syjzH/view',

    // Add more URLs as needed
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Bus Schedules</Text>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {pdfUrls.map((url, index) => (
          <View key={index} style={styles.pdfContainer}>
            <WebView
              source={{ uri: url }}
              style={styles.webview}
              scalesPageToFit={true} // Ensures that the PDF fits properly within the WebView
            />
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  scrollContainer: {
    paddingBottom: 20,
  },
  pdfContainer: {
    marginBottom: 50, // Space between PDFs
    height: 400, // Adjust height based on how large you want each PDF to appear
  },
  webview: {
    width: '100%',
    height: '100%', // Take up the entire height of the container
  },
});

export default SchedulesScreen;
