# Time Travel World Clock

A keyboard-first Raycast extension for comparing one moment across multiple cities.

## Interaction

- Type `14:30`, `9am`, `tomorrow 09:00`, `+3h`, or `-30m` to jump through time.
- Press `Command` + `Right/Left Arrow` to move by the configured step.
- Press `Option` + `Right/Left Arrow` to move by one hour.
- Press `Command` + `Shift` + `Right/Left Arrow` to move by one day.
- Use **Return to Now** to resume the live clock.
- Configure cities in Raycast's extension preferences using `Label|IANA timezone` pairs. The first city is the anchor for typed clock times.

Every interaction changes one shared instant, so all city rows move together.

## Store publishing

Replace the `author` value in `package.json` with your Raycast Store username before publishing.

## Development

```sh
npm install
npm test
npm run typecheck
npm run lint
npm run build
npm run dev
```
