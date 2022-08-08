async function main() {
  console.log('main');
  return null;
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
