import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#3c4554',
  },
  calendarWrapper: {
    marginBottom: 16,
  },
  timeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    marginVertical: 8,
    justifyContent: 'center',
  },
  icon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  timeText: {
    fontSize: 16,
    color: '#333',
  },
  input: {
    marginVertical: 8,
  },
  button: {
    marginTop: 16,
  },
  eventList: {
    marginTop: 16,
  },
  eventHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: 'white',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  eventItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  eventText: {
    color: 'white',
    fontSize: 16,
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  eventActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  editButton: {
    flex: 1,
    marginRight: 8,
    backgroundColor: '#4CAF50',
    borderRadius: 5,
    marginVertical: 4,
    paddingVertical: 10,
    textAlign: 'center',
    elevation: 2,
  },
  removeButton: {
    flex: 1,
    backgroundColor: '#F44336',
    borderRadius: 5,
    marginVertical: 4,
    paddingVertical: 10,
    textAlign: 'center',
    elevation: 2,
  },
});

export default styles;
