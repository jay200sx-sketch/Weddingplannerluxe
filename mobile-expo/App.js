import { useEffect, useMemo, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import * as ImagePicker from 'expo-image-picker';
import {
  Image,
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  Switch,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

const Tab = createBottomTabNavigator();
const STORAGE_KEY = 'wedding-planner-native-v1';

const DEFAULT_DATA = {
  onboardingDone: false,
  couple: { partner1: 'Alex', partner2: 'Sam', date: '2027-05-22', venue: 'Rosewood Manor', photoUri: '' },
  budget: { total: 25000, spent: 11100 },
  tasks: [
    { id: '1', title: 'Book venue', done: true },
    { id: '2', title: 'Finalize guest list', done: false },
    { id: '3', title: 'Confirm photographer', done: false },
  ],
  guests: [
    { id: '1', name: 'Olivia Green', rsvp: 'Yes', table: 'Table 1' },
    { id: '2', name: 'Noah Reed', rsvp: 'Pending', table: '' },
  ],
  vendors: [
    { id: '1', name: 'Rosewood Manor', amount: 5200, due: '2026-08-15' },
    { id: '2', name: 'Everlight Studio', amount: 1200, due: '2026-10-01' },
  ],
  tables: ['Table 1', 'Table 2', 'Table 3', 'Table 4', 'Table 5', 'Table 6'],
  ideas: [
    { id: '1', title: 'Blush and champagne palette', budget: 600 },
    { id: '2', title: 'Flower tunnel entrance', budget: 850 },
  ],
  gallery: [],
};

export default function App() {
  const [planner, setPlanner] = useState(DEFAULT_DATA);
  const [ready, setReady] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const merged = { ...DEFAULT_DATA, ...JSON.parse(raw) };
          setPlanner(merged);
          setShowOnboarding(!merged.onboardingDone);
        } else {
          setShowOnboarding(true);
        }
      } finally {
        setReady(true);
      }
    })();
  }, []);

  useEffect(() => {
    if (!ready) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(planner));
  }, [planner, ready]);

  if (!ready) {
    return (
      <SafeAreaView style={styles.center}>
        <Text style={styles.title}>Loading Wedding Planner Luxe...</Text>
      </SafeAreaView>
    );
  }

  return (
    <NavigationContainer>
      <StatusBar style="dark" />
      <OnboardingModal
        visible={showOnboarding}
        planner={planner}
        setPlanner={setPlanner}
        onClose={() => {
          setPlanner((p) => ({ ...p, onboardingDone: true }));
          setShowOnboarding(false);
        }}
      />
      <Tab.Navigator screenOptions={{ headerStyle: styles.header, headerTitleStyle: styles.headerTitle, tabBarActiveTintColor: '#b03069' }}>
        <Tab.Screen name="Dashboard">
          {() => <DashboardScreen planner={planner} setPlanner={setPlanner} />}
        </Tab.Screen>
        <Tab.Screen name="Budget">
          {() => <BudgetScreen planner={planner} setPlanner={setPlanner} />}
        </Tab.Screen>
        <Tab.Screen name="Tasks">
          {() => <TasksScreen planner={planner} setPlanner={setPlanner} />}
        </Tab.Screen>
        <Tab.Screen name="Guests">
          {() => <GuestsScreen planner={planner} setPlanner={setPlanner} />}
        </Tab.Screen>
        <Tab.Screen name="Seating">
          {() => <SeatingScreen planner={planner} setPlanner={setPlanner} />}
        </Tab.Screen>
        <Tab.Screen name="Vendors">
          {() => <VendorsScreen planner={planner} />}
        </Tab.Screen>
        <Tab.Screen name="Ideas">
          {() => <IdeasScreen planner={planner} setPlanner={setPlanner} />}
        </Tab.Screen>
      </Tab.Navigator>
    </NavigationContainer>
  );
}

function DashboardScreen({ planner, setPlanner }) {
  const remaining = planner.budget.total - planner.budget.spent;
  const completed = planner.tasks.filter((t) => t.done).length;
  const attending = planner.guests.filter((g) => g.rsvp === 'Yes').length;
  const pickCouplePhoto = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return;
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.8 });
    if (!result.canceled && result.assets?.[0]?.uri) {
      setPlanner((p) => ({ ...p, couple: { ...p.couple, photoUri: result.assets[0].uri } }));
    }
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.pad}>
      <Card>
        <View style={styles.heroRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>{planner.couple.partner1} & {planner.couple.partner2}</Text>
            <Text style={styles.subtitle}>{planner.couple.date} · {planner.couple.venue}</Text>
            <Pressable style={[styles.button, styles.smallButton]} onPress={pickCouplePhoto}>
              <Text style={styles.buttonText}>Upload Couple Photo</Text>
            </Pressable>
          </View>
          {planner.couple.photoUri ? (
            <Image source={{ uri: planner.couple.photoUri }} style={styles.couplePhoto} />
          ) : (
            <View style={styles.photoPlaceholder}>
              <Text style={styles.subtitle}>No photo</Text>
            </View>
          )}
        </View>
      </Card>
      <Card>
        <Text style={styles.cardTitle}>Quick Couple Details</Text>
        <Field
          label="Partner 1"
          value={planner.couple.partner1}
          onChangeText={(value) => setPlanner((p) => ({ ...p, couple: { ...p.couple, partner1: value } }))}
        />
        <Field
          label="Partner 2"
          value={planner.couple.partner2}
          onChangeText={(value) => setPlanner((p) => ({ ...p, couple: { ...p.couple, partner2: value } }))}
        />
      </Card>
      <View style={styles.row}>
        <StatCard label="Budget Total" value={`$${planner.budget.total.toLocaleString()}`} />
        <StatCard label="Remaining" value={`$${remaining.toLocaleString()}`} />
      </View>
      <Card>
        <Text style={styles.cardTitle}>Progress</Text>
        <Text style={styles.line}>{completed}/{planner.tasks.length} tasks completed</Text>
        <Text style={styles.line}>{planner.guests.length} guests tracked · {attending} attending</Text>
      </Card>
    </ScrollView>
  );
}

function BudgetScreen({ planner, setPlanner }) {
  const remaining = useMemo(() => planner.budget.total - planner.budget.spent, [planner]);
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.pad}>
      <Card>
        <Text style={styles.cardTitle}>Budget & Spending</Text>
        <Field
          label="Total Budget"
          keyboardType="numeric"
          value={String(planner.budget.total)}
          onChangeText={(value) =>
            setPlanner((p) => ({ ...p, budget: { ...p.budget, total: Number(value) || 0 } }))
          }
        />
        <Field
          label="Total Spent"
          keyboardType="numeric"
          value={String(planner.budget.spent)}
          onChangeText={(value) =>
            setPlanner((p) => ({ ...p, budget: { ...p.budget, spent: Number(value) || 0 } }))
          }
        />
        <Text style={styles.line}>Remaining: ${remaining.toLocaleString()}</Text>
      </Card>
    </ScrollView>
  );
}

function TasksScreen({ planner, setPlanner }) {
  const toggleTask = (id) =>
    setPlanner((p) => ({
      ...p,
      tasks: p.tasks.map((task) => (task.id === id ? { ...task, done: !task.done } : task)),
    }));

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.pad}>
      <Card>
        <Text style={styles.cardTitle}>Checklist</Text>
        {planner.tasks.map((task) => (
          <Pressable key={task.id} style={styles.taskRow} onPress={() => toggleTask(task.id)}>
            <Text style={task.done ? styles.taskDone : styles.taskText}>
              {task.done ? '✓ ' : '○ '}
              {task.title}
            </Text>
          </Pressable>
        ))}
        <Pressable
          style={styles.button}
          onPress={() =>
            setPlanner((p) => ({
              ...p,
              tasks: [...p.tasks, { id: String(Date.now()), title: 'New task', done: false }],
            }))
          }
        >
          <Text style={styles.buttonText}>Add Task</Text>
        </Pressable>
      </Card>
    </ScrollView>
  );
}

function GuestsScreen({ planner, setPlanner }) {
  const [newGuest, setNewGuest] = useState('');
  const addGuest = () => {
    const trimmed = newGuest.trim();
    if (!trimmed) return;
    setPlanner((p) => ({
      ...p,
      guests: [...p.guests, { id: String(Date.now()), name: trimmed, rsvp: 'Pending' }],
    }));
    setNewGuest('');
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.pad}>
      <Card>
        <Text style={styles.cardTitle}>Guest List</Text>
        <Field label="Add guest" value={newGuest} onChangeText={setNewGuest} />
        <Pressable style={styles.button} onPress={addGuest}>
          <Text style={styles.buttonText}>Add Guest</Text>
        </Pressable>
        {planner.guests.map((guest) => (
          <View key={guest.id} style={styles.vendorRow}>
            <Text style={styles.line}>{guest.name} · {guest.rsvp || 'Pending'}</Text>
            <View style={styles.inlineRow}>
              <Pressable
                style={styles.choiceBtn}
                onPress={() =>
                  setPlanner((p) => ({
                    ...p,
                    guests: p.guests.map((g) => (g.id === guest.id ? { ...g, rsvp: 'Yes' } : g)),
                  }))
                }
              >
                <Text style={styles.choiceTxt}>Yes</Text>
              </Pressable>
              <Pressable
                style={styles.choiceBtn}
                onPress={() =>
                  setPlanner((p) => ({
                    ...p,
                    guests: p.guests.map((g) => (g.id === guest.id ? { ...g, rsvp: 'No' } : g)),
                  }))
                }
              >
                <Text style={styles.choiceTxt}>No</Text>
              </Pressable>
            </View>
          </View>
        ))}
      </Card>
    </ScrollView>
  );
}

function SeatingScreen({ planner, setPlanner }) {
  const assign = (guestId, table) =>
    setPlanner((p) => ({
      ...p,
      guests: p.guests.map((g) => (g.id === guestId ? { ...g, table } : g)),
    }));

  const tableCounts = planner.tables.map((table) => ({
    table,
    count: planner.guests.filter((guest) => guest.table === table).length,
  }));

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.pad}>
      <Card>
        <Text style={styles.cardTitle}>Seating Planner</Text>
        {tableCounts.map((item) => (
          <Text key={item.table} style={styles.line}>{item.table}: {item.count} assigned</Text>
        ))}
      </Card>
      <Card>
        <Text style={styles.cardTitle}>Assign Guests</Text>
        {planner.guests.map((guest) => (
          <View key={guest.id} style={styles.vendorRow}>
            <Text style={styles.line}>{guest.name} · {guest.table || 'Unassigned'}</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.inlineRow}>
                <Pressable style={styles.choiceBtn} onPress={() => assign(guest.id, '')}>
                  <Text style={styles.choiceTxt}>None</Text>
                </Pressable>
                {planner.tables.map((table) => (
                  <Pressable key={table} style={styles.choiceBtn} onPress={() => assign(guest.id, table)}>
                    <Text style={styles.choiceTxt}>{table}</Text>
                  </Pressable>
                ))}
              </View>
            </ScrollView>
          </View>
        ))}
      </Card>
    </ScrollView>
  );
}

function VendorsScreen({ planner }) {
  const sorted = [...planner.vendors].sort((a, b) => String(a.due).localeCompare(String(b.due)));
  const monthGroups = sorted.reduce((acc, vendor) => {
    const month = vendor.due?.slice(0, 7) || 'No due date';
    if (!acc[month]) acc[month] = [];
    acc[month].push(vendor);
    return acc;
  }, {});

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.pad}>
      <Card>
        <Text style={styles.cardTitle}>Vendor Reminders</Text>
        {Object.keys(monthGroups).map((month) => (
          <View key={month}>
            <Text style={styles.sectionLabel}>{month}</Text>
            {monthGroups[month].map((vendor) => (
              <View key={vendor.id} style={styles.vendorRow}>
                <Text style={styles.line}>{vendor.name}</Text>
                <Text style={styles.subtitle}>${vendor.amount.toLocaleString()} due {vendor.due}</Text>
              </View>
            ))}
          </View>
        ))}
      </Card>
    </ScrollView>
  );
}

function IdeasScreen({ planner, setPlanner }) {
  const [ideaTitle, setIdeaTitle] = useState('');
  const [ideaBudget, setIdeaBudget] = useState('');

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return;
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.75 });
    if (!result.canceled && result.assets?.[0]?.uri) {
      setPlanner((p) => ({
        ...p,
        gallery: [...p.gallery, { id: String(Date.now()), uri: result.assets[0].uri }],
      }));
    }
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.pad}>
      <Card>
        <Text style={styles.cardTitle}>Ideas Board</Text>
        <Field label="Idea title" value={ideaTitle} onChangeText={setIdeaTitle} />
        <Field label="Budget estimate" value={ideaBudget} onChangeText={setIdeaBudget} keyboardType="numeric" />
        <Pressable
          style={styles.button}
          onPress={() => {
            if (!ideaTitle.trim()) return;
            setPlanner((p) => ({
              ...p,
              ideas: [
                ...p.ideas,
                { id: String(Date.now()), title: ideaTitle.trim(), budget: Number(ideaBudget) || 0 },
              ],
            }));
            setIdeaTitle('');
            setIdeaBudget('');
          }}
        >
          <Text style={styles.buttonText}>Add Idea</Text>
        </Pressable>
        {planner.ideas.map((idea) => (
          <Text key={idea.id} style={styles.line}>• {idea.title} (${idea.budget})</Text>
        ))}
      </Card>
      <Card>
        <Text style={styles.cardTitle}>Inspiration Gallery</Text>
        <Pressable style={styles.button} onPress={pickImage}>
          <Text style={styles.buttonText}>Add Photo</Text>
        </Pressable>
        <View style={styles.gallery}>
          {planner.gallery.map((item) => (
            <Image key={item.id} source={{ uri: item.uri }} style={styles.galleryImg} />
          ))}
        </View>
      </Card>
    </ScrollView>
  );
}

function OnboardingModal({ visible, planner, setPlanner, onClose }) {
  const [step, setStep] = useState(0);
  useEffect(() => {
    if (!visible) setStep(0);
  }, [visible]);

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalBackdrop}>
        <View style={styles.modalCard}>
          <Text style={styles.cardTitle}>Premium Onboarding</Text>
          {step === 0 ? (
            <>
              <Field label="Partner 1" value={planner.couple.partner1} onChangeText={(value) => setPlanner((p) => ({ ...p, couple: { ...p.couple, partner1: value } }))} />
              <Field label="Partner 2" value={planner.couple.partner2} onChangeText={(value) => setPlanner((p) => ({ ...p, couple: { ...p.couple, partner2: value } }))} />
              <Field label="Wedding Date" value={planner.couple.date} onChangeText={(value) => setPlanner((p) => ({ ...p, couple: { ...p.couple, date: value } }))} />
            </>
          ) : (
            <>
              <Field label="Venue" value={planner.couple.venue} onChangeText={(value) => setPlanner((p) => ({ ...p, couple: { ...p.couple, venue: value } }))} />
              <Field label="Budget total" value={String(planner.budget.total)} keyboardType="numeric" onChangeText={(value) => setPlanner((p) => ({ ...p, budget: { ...p.budget, total: Number(value) || 0 } }))} />
              <View style={styles.switchRow}>
                <Text style={styles.subtitle}>Start with sample checklist</Text>
                <Switch value={planner.tasks.length > 0} onValueChange={(enabled) => setPlanner((p) => ({ ...p, tasks: enabled ? p.tasks : [] }))} />
              </View>
            </>
          )}
          <View style={styles.inlineRowBetween}>
            <Pressable style={styles.choiceBtn} onPress={() => (step === 0 ? onClose() : setStep(0))}>
              <Text style={styles.choiceTxt}>{step === 0 ? 'Skip' : 'Back'}</Text>
            </Pressable>
            <Pressable style={styles.button} onPress={() => (step === 0 ? setStep(1) : onClose())}>
              <Text style={styles.buttonText}>{step === 0 ? 'Next' : 'Finish'}</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

function Card({ children }) {
  return <View style={styles.card}>{children}</View>;
}

function StatCard({ label, value }) {
  return (
    <View style={[styles.card, styles.stat]}>
      <Text style={styles.subtitle}>{label}</Text>
      <Text style={styles.title}>{value}</Text>
    </View>
  );
}

function Field({ label, ...props }) {
  return (
    <View style={styles.fieldWrap}>
      <Text style={styles.subtitle}>{label}</Text>
      <TextInput style={styles.input} {...props} />
    </View>
  );
}

const styles = StyleSheet.create({
  header: { backgroundColor: '#fff4fb' },
  headerTitle: { color: '#8a315c', fontWeight: '700' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff9fc' },
  screen: { flex: 1, backgroundColor: '#fff9fc' },
  pad: { padding: 14, gap: 12, paddingBottom: 20 },
  card: { backgroundColor: '#fff', borderRadius: 14, borderColor: '#f2bfd8', borderWidth: 1, padding: 12 },
  row: { flexDirection: 'row', gap: 10 },
  heroRow: { flexDirection: 'row', gap: 12, alignItems: 'center' },
  stat: { flex: 1 },
  title: { color: '#8a315c', fontWeight: '700', fontSize: 18 },
  subtitle: { color: '#98506e', fontSize: 13 },
  cardTitle: { color: '#8a315c', fontWeight: '700', fontSize: 16, marginBottom: 8 },
  line: { color: '#71364f', marginTop: 4 },
  fieldWrap: { marginBottom: 10 },
  input: {
    marginTop: 4,
    borderWidth: 1,
    borderColor: '#efb5d1',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    color: '#5a233b',
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#b03069',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 8,
  },
  smallButton: { marginTop: 8, marginBottom: 0, alignSelf: 'flex-start', paddingHorizontal: 12 },
  buttonText: { color: '#fff', fontWeight: '700' },
  taskRow: { paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#f7d9e8' },
  taskText: { color: '#6d2f49' },
  taskDone: { color: '#6d2f49', textDecorationLine: 'line-through' },
  vendorRow: { paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#f7d9e8' },
  inlineRow: { flexDirection: 'row', gap: 8, marginTop: 6 },
  inlineRowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 },
  choiceBtn: { borderWidth: 1, borderColor: '#efb5d1', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6, backgroundColor: '#fff7fb' },
  choiceTxt: { color: '#8a315c', fontWeight: '600' },
  sectionLabel: { marginTop: 8, marginBottom: 4, color: '#8a315c', fontWeight: '700' },
  gallery: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 8 },
  galleryImg: { width: 92, height: 92, borderRadius: 10, borderWidth: 1, borderColor: '#f0c2d9' },
  couplePhoto: { width: 88, height: 88, borderRadius: 44, borderWidth: 2, borderColor: '#f0c2d9' },
  photoPlaceholder: { width: 88, height: 88, borderRadius: 44, borderWidth: 1, borderColor: '#efb5d1', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff7fb' },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(66,25,45,0.38)', alignItems: 'center', justifyContent: 'center', padding: 16 },
  modalCard: { width: '100%', maxWidth: 460, backgroundColor: '#fff', borderRadius: 14, borderWidth: 1, borderColor: '#f2bfd8', padding: 14 },
  switchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
});
